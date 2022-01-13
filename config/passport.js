var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt')

var Student = require('../models/student')
var Account = require('../models/account')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || '/auth/google/callback',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log(profile)
        // console.log('accesstoken: '+accessToken)

        // ==== Check domain if it tdtu mail or not
        // 1 ---- MATCHED
        if(profile._json.domain && profile._json.domain == 'student.tdtu.edu.vn'){
            var studentId = profile.emails[0].value.replace('@student.tdtu.edu.vn', '')
            // console.log(studentId)
            // ==== Modify program for student
            var programCode = studentId.substring(3,4),
                program = ''
            if(programCode == '0'){
                program = 'standar'
            } else if( programCode == 'h' || programCode == 'H'){
                program = 'high'
            } else {
                program = 'international'
            }
            // ==== Find student by googleId
            Student.findOne({ googleId: profile.id }, (error, student) => {
                // 2.1 ---- ERR
                if(error){
                    return done(null, null);
                // 2.2 ---- FOUND: user has already sign in before by google
                } else if (student){
                    // Check if student have an account or not by accountId
                    Account.findById(student.accountId, (err, account) => {
                        // 2.2.1 ---- ERR
                        if(err) return done(null, null);
                        // 2.2.2 ---- FOUND
                        else if(account){
                            req._account = account
                            req._student = student
                            console.log('1---------------' + req._student)
                            // ==== Return success signal
                            return done(null, student);
                        // 2.2.3 ---- NOT FOUND
                        } else {
                            req.flash('error', 'Your account is not found')
                            // ==== Return failed signal
                            return done(null, null);
                        }
                        
                    })
                // 2.3 ---- NOT FOUND: user hasn't signed in before
                }else{
                    console.log('2---------------------------- Not found')
                    // ==== Create new account by email info
                    new Account({
                        username: studentId,
                        hashedPassword: bcrypt.hashSync(studentId, 10),
                        avatar: profile.photos[0].value || profile.picture || profile._json.picture ||  '', // gg coverPhoto
                        roleId: 1,
                    }).save((err, account) => {
                        if(err) {
                            console.log('3------------------')
                            console.log(err)
                            return done(null, null);
                        }
                        new Student({
                            googleId: profile.id,// gg id
                            fullname: profile.displayName || profile._json.name, // gg displayname
                            studentId: studentId,
                            studentEmail: profile.emails[0].value || profile.email || profile._json.email || '', // gg email
                            facultyCode: studentId.substring(0,1),
                            accountId: account._id,
                            gender: profile.gender || '', // gg gender
                            schoolYear: studentId.substring(1,3), // the year start
                            program: program, // high quaity or standar
                        }).save((err, student) => {
                            if(err) {
                                console.log('4----------------')
                                console.log(err)
                                return done(null, null);
                            }
                            else{
                                req._student = student
                                req._account = account
                                console.log('5--------------------')
                                // ==== Return success signal
                                return done(null, student);
                            }
                        })
                    })
                }
            });
        // 2 ---- NOT MATCHED
        } else {
            req.flash('error', 'Use student email please!')
            // ==== Return failed signal
            return done(null, null)
        }
    }));
    passport.serializeUser((student, done) => {
        done(null, student.id);
    });
      
    passport.deserializeUser((id, done) => {
        Student.findById(id, (err, student) => done(err, student));
    });
}
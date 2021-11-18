var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt')

var Student = require('../models/student')
var Account = require('../models/account')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: '442702306670-ek3o50ifmn546sb635ha420mffgghijg.apps.googleusercontent.com' || process.env.GOOGLE_CLIENT_ID,
        clientSecret: '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' || process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true
      },
    (req, accessToken, refreshToken, profile, done) => {
        // console.log('profile: '+profile)
        // console.log('accesstoken: '+accessToken)
        if(profile._json.domain == 'student.tdtu.edu.vn'){
            var studentId = profile.emails[0].value.replace('@student.tdtu.edu.vn', '')
            // console.log(studentId)
            var programCode = studentId.substring(3,4),
                program = ''
            if(programCode == '0'){
                program = 'standar'
            } else if( programCode == 'h' || programCode == 'H'){
                program = 'high'
            } else {
                program = 'international'
            }
            Student.findOne({ googleId: profile.id }, (error, student) => {
                if(student){
                    req._student = student
                    console.log('1---------------' + req._student)
                    return done(null, student);
                }else{
                    console.log('2----------------------------')
                    new Account({
                        username: studentId,
                        hashedPassword: bcrypt.hashSync(studentId, 10),
                        roleId: 1,
                    }).save((err, account) => {
                        if(err) {
                            console.log('3------------------')
                            console.log(err)
                            return res.send(500, 'Error occurred: Database error!');
                        }
                        new Student({
                            googleId: profile.id,// gg id
                            fullname: profile.displayName, // gg displayname
                            studentId: studentId,
                            studentEmail: profile.emails[0].value, // gg email
                            facultyCode: studentId.substring(0,1),
                            accountId: account._id,
                            gender: profile.gender || '', // gg gender
                            avatar: profile.photos[0].value, // gg coverPhoto
                            schoolYear: studentId.substring(1,3), // the year start
                            program: program, // high quaity or standar
                        }).save((err, student) => {
                            if(err) {
                                console.log('4----------------')
                                console.log(err)
                                return res.send(500, 'Error occurred: Database error!');
                            }
                            else{
                                req._student = student
                                console.log('5--------------------')
                                return done(null, student);
                            }
                        })
                    })
                }
            });
            
        } else {
            return done(null, null)
        }
        
        // console.log(profile)
      }
    ));
    passport.serializeUser((student, done) => {
        done(null, student.id);
    });
      
    passport.deserializeUser((id, done) => {
        Student.findById(id, (err, student) => done(err, student));
    });
}
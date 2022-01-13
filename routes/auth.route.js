// const flash = require('connect-flash');
var express = require('express')
var passport = require('passport')
var router = express.Router()

var studentApis = require('../apis/student/student.api.method');

// @desc GG Auth
// @route GET /auth/google
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


// @desc GG auth callback
// @route GET /auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', 
    { failureRedirect: '/login' }), 
    (req, res) => {
        // console.log('flash:-----------' + req._account)
        var sid = req._student._id;
        console.log('------------------INNNNN--------------------')
        console.log('id: ' + sid)
        studentApis.getStudent(sid, (student) => {
            // ==== Assign session for authentication
            console.log('------------------INNNNN 222222222222222--------------------')

            req.session.user = student
            req.session.roleId = req._account.roleId
            req.session.isAuth = true;
            console.log('AUTH----------')
            console.log(student)
            // ==== GET /
            return res.redirect('/');
        }, (err) => {
            console.log('------------------INnnn11111111111111112--------------------')
            return res.redirect('/login')
        })
    }
);

// @desc GG logout
// @route GET /logout
router.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy((err)=>{
        if(err) return next(err)
        return res.redirect('/login')
    })
})

module.exports = router
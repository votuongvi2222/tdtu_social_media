const flash = require('connect-flash/lib/flash');
var express = require('express')
var passport = require('passport')
var router = express.Router()


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
        // console.log('flash:-----------' + req._student.avatar)
        req.flash('role', {'id':'1'})
        req.flash('user', {'info': req._student})
        res.redirect('/')
    }
);

module.exports = router
// const flash = require('connect-flash');
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
        // console.log('flash:-----------' + req._account)
        req.session.username = req._account.username
        req.session.roleId = req._account.roleId
        req.session.user = req._student
        res.redirect('/')
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
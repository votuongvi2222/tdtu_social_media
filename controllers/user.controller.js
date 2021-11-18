var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role')

var loadLoginPage = (req, res) => {
    res.render('login', { title: 'Login' });
}
var loadHomePage = (req, res) => {
    // console.log(req.flash('avatar')[0])
    if(!req.session.user)
        return res.redirect('/login');
    var user = req.session.user
    var roleId = req.session.roleId
    if(roleId == '1')
        avatar = user.avatar
    else
        avatar = "images/avatar.png"

    // console.log(user.link+'-==================')
    res.render('home', { title: 'Home', user: user, avatar: avatar, fullname: user.fullname });
}
var loadPostFormPage = (req, res) => {
    res.render('post-form', { title: 'Add Noti' });
}
var loadWallPage = (req, res) => {
    res.render('personal', { title: 'Wall' });
}
var loadAboutPage = (req, res) => {
    res.render('howitworks', { title: 'About' });
}
var loadNotiPagePerDep = (req, res) => {
    res.render('notiper', { title: 'Notification' });
}

module.exports = {
    loadHomePage: loadHomePage,
    loadAboutPage: loadAboutPage,
    loadLoginPage: loadLoginPage,
    loadNotiPagePerDep: loadNotiPagePerDep,
    loadPostFormPage: loadPostFormPage,
    loadWallPage: loadWallPage
}
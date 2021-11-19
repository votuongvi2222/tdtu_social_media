var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role')

var loadLoginPage = (req, res) => {
    var message = req.flash('error') || '';
    res.render('login', {title: 'Login', message: message});
}
var loadHomePage = (req, res) => {
    // console.log(req.flash('avatar')[0])
    var user = req.session.user || ''
    var username = req.session.username
    var roleId = req.session.roleId

    res.render('home', { title: 'Home', user: user, username: username, roleId: roleId});
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
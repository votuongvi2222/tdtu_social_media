var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role'),
    Student = require('../models/student');

var loadLoginPage = (req, res) => {
    res.render('login', {title: 'Login', message: req.flash('error') || ''});
}

var login = (req, res) => {
    var {username, password} = req.body;
    // console.log('uname: '+username)
    // console.log('pass: ' + password)

    // ==== Find Account by username from form
    Account.findOne({
        username: username,
    }, (err, account) => {
        //  1 ---- ERR
        if(err) return res.send(500, 'Error occurred: Database error!');
        //  2 ---- FOUND
        else if(account) {
            // ==== Compare password
            var isFound = account.comparePassword(password, account.hashedPassword)
            console.log('isfound: ' + isFound)
            //  2.1 ---- NOT MATCHED
            if(!isFound){
                req.flash('error', 'Wrong password!')
                return res.redirect('/login')
            //  2.2 ---- MATCHED
            }else{
                //  2.2.1 ---- USER IS A STUDENT
                if(account.roleId == 1 || account.roleId == '1') {
                    // ==== Find student info
                    Student.findOne({
                        accountId: account._id
                    }, (err, student) => {
                        //  2.2.1.1 ---- ERR
                        if(err) return res.send(500, 'Error occurred: Database error!');
                        //  2.2.1.2 ---- FOUND
                        else if (student) {
                            req.session.user = student
                        //  2.2.1.3 ---- NOT FOUND
                        } else {
                            req.flash('error', 'You are not a student!')
                            // ==== GET /login
                            return res.redirect('/login');
                        }
                    })
                //  2.2.2 ---- USER IS A STAFF OF A DEPARTMENT
                } else if (account.roleId == 2 || account.roleId == '2') {
                    // ==== Find department info
                    Department.findOne({
                        accountId: account._id
                    }, (err, department) => {
                        //  2.2.2.1 ---- ERR
                        if(err) return res.send(500, 'Error occurred: Database error!');
                        //  2.2.2.2 ---- FOUND
                        else if (department) {
                            req.session.user = department
                        //  2.2.2.3 ---- NOT FOUND
                        } else {
                            req.flash('error', 'You are not a staff!')
                            // ==== GET /login
                            return res.redirect('/login');
                        }
                    })
                //  2.2.3 ---- USER IS ADMIN
                } else {
                    req.session.user = account
                }
                // ==== Assign session for authentication
                req.session.roleId = account.roleId
                req.session.username = account.username
                req.session.isAuth = true;
                console.log('OK')
                // ==== GET /
                return res.redirect('/');
            }
        // 3 ---- NOT FOUND
        } else {
            req.flash('error', 'Username is not found!')
            // ==== GET /login
            return res.redirect('/login');
        }
    })
}
var loadHomePage = (req, res) => {
    // console.log(req.flash('avatar')[0])
    var {user, username, roleId} = req.session

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
    loadWallPage: loadWallPage,
    login: login
}
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    path = require('path')
    randomstring = require("randomstring");
var Department = require('../models/department'),
    Account = require('../models/account'),
    Role = require('../models/role'),
    Notification = require('../models/notification'),
    Topic = require('../models/topic'),
    Student = require('../models/student');

var studentApis = require('../apis/student/student.api.method'),
    departmentApis = require('../apis/department/department.api.method');


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
                            console.log('IS STUDENT')
                            // ==== Assign session for authentication
                            studentApis.getStudent(student._id, (studentData) => {
                                // ==== Assign session for authentication
                                console.log('data')
                                console.log(studentData)
                                req.session.user = studentData
                                req.session.roleId = account.roleId
                                req.session.isAuth = true;
                                console.log('OK')
                                // ==== GET /
                                return res.redirect('/');
                            }, (err) => {
                                return res.redirect('/login')
                            })
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
                            console.log('Is department')
                            departmentApis.getDepartment(department._id, (departmentData) => {
                                // ==== Assign session for authentication
                                req.session.user = departmentData
                                req.session.roleId = account.roleId
                                req.session.username = account.username
                                req.session.userId = account._id
                                req.session.isAuth = true;
                                console.log('OK')
                                console.log(req.session.user)
                                // ==== GET /
                                return res.redirect('/');
                            }, (err) => {
                                req.flash('error', 'You are not a staff!')
                            })
                            
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
    var {user, roleId} = req.session
    console.log(user)
    res.render('home', { title: 'Home', user: user, roleId: roleId});
}
var loadPostFormPage = (req, res) => {
    var {user, roleId} = req.session
    res.render('post-form', { title: 'Add Noti', user: user, roleId: roleId  });
}
var loadAboutPage = (req, res) => {
    var {user, roleId} = req.session
    res.render('howitworks', { title: 'About', user: user, roleId: roleId  });
}
var loadNotiPagePerDep = (req, res) => {
    var {user, roleId} = req.session
    res.render('notiper', { title: 'Notification', user: user, roleId: roleId });
}

var loadNotiDetail = (req, res) => {
    var {user, roleId} = req.session
    res.render('class', { title: 'Notification', user: user, roleId: roleId });
}
var loadAllNotiPage = (req, res) => {
    var {user, roleId} = req.session
    res.render('allnoti', { title: 'Notification', user: user, roleId: roleId });
}

var loadPersonalPageById = (req, res) => {
    var {user, roleId} = req.session
    var path = req.params.id
    var personal = path.split('.')
    console.log(path)
    console.log(personal)
    console.log(personal[1])
    studentApis.getStudentByAccId(personal[1], (studentData) => {
        res.render('personal', { title: user.username, user: user, roleId: roleId, personal: studentData});
    }, (err) => {
        return res.redirect('/')
    })
}

// var addNoti = async (req, res) => {
//     // =================== check role ===========================
//     try{
//         var {user, roleId} = req.session
//         if(roleId == 1){
//             res.render('home', { title: 'Home', user: user, roleId: roleId});
//         }
//         const files =  req.files.notiFiles
//         console.log(path.join(__dirname, '../public', 'uploads'))
//         const fPaths = await Promise.all(files.map(async (file)=>{
//             const fName = new Date().getTime().toString() + path.extname(file.name)
//             const fPath = path.join(__dirname, '../public', 'uploads', fName)
//             console.log(fPath)
//             return file.mv(fPath)
//         }))
//         console.log('Paths')
//         console.log(fPaths)
//         // ========================= create topic ==========================
//         var isExistedTopic = await Topic.findOne({name: req.body.category})
//         console.log(isExistedTopic)
//         var topicId = '';
//         if(isExistedTopic == null){
//             const topic = new Topic({
//                 accountId: user.account.id,
//                 name: req.body.category
//             })
//             await topic.save()
//             topicId = topic._id
//         }else{
//             console.log('not')
//             topicId = isExistedTopic._id

//         }
//         const department = await Department.findOne({departmentCode: user.code})
//         const notification = new Notification({
//             title: req.body.title || '',
//             content: 'smth',
//             departmentCode: department.departmentCode || '',
//             files: fPaths || [],
//             publishDate: req.body.public_time || new Date().toISOString().slice(0, 10),
//             topicIds: [topicId] || [],
//         });
//         await notification.save();
//         console.log(notification)
//         return res.render('home', { title: 'Home', user: user, roleId: roleId});
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// }

module.exports = {
    loadHomePage: loadHomePage,
    loadAboutPage: loadAboutPage,
    loadLoginPage: loadLoginPage,
    loadAllNotiPage: loadAllNotiPage,
    loadNotiDetail: loadNotiDetail,
    loadNotiPagePerDep: loadNotiPagePerDep,
    loadPostFormPage: loadPostFormPage,
    loadPersonalPageById: loadPersonalPageById,
    // addNoti: addNoti,
    login: login
}
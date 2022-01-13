var Notification = require('../../models/notification'),
    Department = require('../../models/department'),
    Topic = require('../../models/topic'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    moment = require('moment'),
    bcrypt = require('bcrypt');
var path = require('path');


var getNotifications =  async (req, res) => {
    try {
        const notifications = await Notification.find({});
        const notificationsInfo = await Promise.all(
            notifications.map(async (notification) => {
                const department = await Department.findOne({departmentCode: notification.departmentCode})

                return {
                    id: notification._id,
                    title: notification.title || '',
                    department: department,
                    content: notification.content || '',
                    files: notification.files || [],
                    publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
                    topicIds: notification.topicIds || [],
                    createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                }
            }
        ))
        return res.json(notificationsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getNotificationsInRange =  async (req, res) => {
    try {
        const notifications = await Notification.find({})
                                                .sort({'createdAt': -1})
                                                .skip(parseInt(req.params.start))
                                                .limit(parseInt(req.params.limit));
        const notificationsInfo = await Promise.all(
            notifications.map(async (notification) => {
                const department = await Department.findOne({departmentCode: notification.departmentCode})

                return {
                    id: notification._id,
                    title: notification.title || '',
                    department: department,
                    content: notification.content || '',
                    files: notification.files || [],
                    publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
                    topicIds: notification.topicIds || [],
                    createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                }
            }
        ))
        return res.json(notificationsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getNotificationsByTopicId =  async (req, res) => {
    try {
        const notifications = await Notification.find({topicIds: [req.params.id]})
        const notificationsInfo = await Promise.all(
            notifications.map(async (notification) => {
                const department = await Department.findOne({departmentCode: notification.departmentCode})

                return {
                    id: notification._id,
                    title: notification.title || '',
                    department: department,
                    content: notification.content || '',
                    files: notification.files || [],
                    publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
                    topicIds: notification.topicIds || [],
                    createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                }
            }
        ))
        return res.json(notificationsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getNotificationsByDepartmentId =  async (req, res) => {
    try {
        const notifications = await Notification.find({departmentCode: [req.params.id]}).sort({'createdAt': -1})
        const notificationsInfo = await Promise.all(
            notifications.map(async (notification) => {
                const department = await Department.findOne({departmentCode: notification.departmentCode})

                return {
                    id: notification._id,
                    title: notification.title || '',
                    department: department,
                    content: notification.content || '',
                    files: notification.files || [],
                    publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
                    topicIds: notification.topicIds || [],
                    createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                }
            }
        ))
        return res.json(notificationsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
var getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        const department = await Department.findOne({departmentCode: notification.departmentCode})
        return res.json({
            id: notification._id,
            title: notification.title || '',
            department: department,
            content: notification.content || '',
            files: notification.files || [],
            publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
            topicIds: notification.topicIds || [],
            createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        const department = await Department.findOne({departmentCode: req.body.departmentCode})
        notification.departmentCode = department.departmentCode;
        notification.title = req.body.title || '';
        notification.content = req.body.content || '';
        notification.files = req.body.files || [];
        notification.publishDate = req.body.publishDate || new Date().toISOString().slice(0, 10);
        notification.topicIds = req.body.topicIds || [];
        await notification.save();
        return res.json({
            id: notification._id,
            title: notification.title || '',
            department: department,
            content: notification.content || '',
            files: notification.files || [],
            publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
            topicIds: notification.topicIds || [],
            createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postNotification = async (req, res) => {
    try {
        // =================== check role ===========================
        var {user, roleId} = req.session
        if(roleId == 1){
            res.render('home', { title: 'Home', user: user, roleId: roleId});
        }
        // ========================= create topic ==========================
        const isExistedTopic = await Topic.findById(req.body.topicTitle)
        const department = await Department.findOne({departmentCode: req.body.departmentCode})
        const notification = new Notification({
            title: req.body.title || '',
            content: req.body.content || '',
            departmentCode: department.departmentCode || '',
            files: [],
            publishDate: req.body.publishDate || new Date().toISOString().slice(0, 10),
            topicIds: [isExistedTopic._id],
        });
        await notification.save();
        return res.json({
            id: notification._id,
            title: notification.title || '',
            department: department,
            content: notification.content || '',
            files: notification.files || [],
            publishDate:  moment(notification.publishDate).format("dddd, MMMM Do YYYY, h:mm:ss a") || new Date().toISOString().slice(0, 10),
            topicIds: notification.topicIds || [],
            createdTime: moment(notification.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(notification.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        await notification.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteNotificationById: deleteNotificationById,
    getNotificationById: getNotificationById,
    getNotificationsByTopicId: getNotificationsByTopicId,
    getNotificationsByDepartmentId: getNotificationsByDepartmentId,
    getNotificationsInRange: getNotificationsInRange,
    getNotifications: getNotifications,
    putNotificationById: putNotificationById,
    postNotification: postNotification
}
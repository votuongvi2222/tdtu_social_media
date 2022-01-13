var express = require('express');
var router = express.Router();
var notificationApis = require('./notification.api')
/* GET home page. */
router.get('/notifications', notificationApis.getNotifications);
router.get('/notifications/topic/:id', notificationApis.getNotificationsByTopicId);
router.get('/notifications/department/:id', notificationApis.getNotificationsByDepartmentId);
router.get('/notifications/:start/:limit', notificationApis.getNotificationsInRange);
router.get('/notification/:id', notificationApis.getNotificationById);
router.post('/notification', notificationApis.postNotification);
router.put('/notification/:id', notificationApis.putNotificationById);
router.delete('/notification/:id', notificationApis.deleteNotificationById);

module.exports = router;
var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    title: String,
    accountId: String,
    departmentId: String,
    content: String,
    files: [String],
    publishDate: Date,
    topicIds: [String],
}, { timestamps: true });
var Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
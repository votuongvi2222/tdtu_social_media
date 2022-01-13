var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    googleId: { 
        type: String,
        required: true
    },// gg id
    fullname: {
        type: String,
        required: true
    }, // gg displayname
    studentId: {
        type: String,
        unique: true,
        required: true,
    },
    studentEmail: {
        type: String,
        unique: true,
        required: true,
    }, // gg email
    classId: String,
    facultyCode: { 
        type: String,
        required: true
    }, // department code
    birthday: Date, // gg birthdate
    accountId: {
        unique: true,
        type: String
    },
    gender: String, // gg gender
    avatar: String, // gg coverPhoto
    schoolYear: {
        type: Number,
        required: true
    }, // the year start
    program: {
        type: String,
        required: true
    }, // high quaity or standar
    phoneNumber: {
        unique: true,
        type: String
    },
    address: String, // gg places lived
    hometown: String,
    relatives: [{
        name: String,
        relationship: String,
        phoneNumber: String,
        job: String,
    },],
}, { timestamps: true });
var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
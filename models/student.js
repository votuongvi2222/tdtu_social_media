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
    schoolYear: Number, // the year start
    program: String, // high quaity or standar
    phoneNumber: {
        unique: true,
        type: Number
    },
    address: String, // gg places lived
    hometown: String,
    relatives: [{
        name: String,
        relationship: String,
        phoneNumber: Number,
        job: String,
    },],
}, { timestamps: true });
var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
    fullname: String,
    studentId: String,
    studentEmail: String,
    classId: String,
    facultyId: String,
    birthDate: Date,
    accountId: String,
    gender: String,
    schoolYear: Number, // the year start
    programId: String, // high quaity or standar
    phoneNumber: Number,
    address: String,
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
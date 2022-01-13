var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    departmentCode: {
        type: String,
        unique: true,
        required: true
    },
    location: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    website: {
        type: String
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    foundedYear: Number,
    accountId: {
        type: String,
        unique: true,
        required: true
    },
    responsibilities: String, // department codes
}, { timestamps: true });
var Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
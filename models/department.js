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
    accountId: [String],
    responsibilities: [String], // department codes
}, { timestamps: true });
var Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema({
    name: String,
    accountId: String,
    responsibilities: [String],
}, { timestamps: true });
var Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
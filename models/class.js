var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    classId: String,
    facultyId: String,
    schoolYear: Number,
}, { timestamps: true });
var Class = mongoose.model('Class', classSchema);
module.exports = Class;
var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    classId: String,
    facultyCode: { 
        type: String,
        required: true
    }, // department code
    schoolYear: Number,
}, { timestamps: true });
var Class = mongoose.model('Class', classSchema);
module.exports = Class;
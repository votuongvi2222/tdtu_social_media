var mongoose = require('mongoose');

var roleSchema = mongoose.Schema({
    roleCode: {
        type:Number,
        unique: true,
        required: true,
    },
    name: String,
}, { timestamps: true });
var Role = mongoose.model('Role', roleSchema);
module.exports = Role;
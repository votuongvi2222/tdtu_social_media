var mongoose = require('mongoose');

var roleSchema = mongoose.Schema({
    name: String,
}, { timestamps: true });
var Role = mongoose.model('Role', roleSchema);
module.exports = Role;
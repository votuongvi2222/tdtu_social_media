var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var accountSchema = mongoose.Schema({
    username: String,
    nickname: String,
    hashedPassword: String,
    avatar: String,
    roleId: String,
}, { timestamps: true });

accountSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
};
var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
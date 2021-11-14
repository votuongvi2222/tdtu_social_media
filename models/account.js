var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var accountSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    nickname: String,
    hashedPassword: {
        type: String,
        required: true,
    },
    avatar: String,
    roleId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

accountSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
};
var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
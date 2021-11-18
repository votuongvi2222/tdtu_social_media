var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var accountSchema = mongoose.Schema({
    username: { // displayname
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    roleId: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

accountSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
};
var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
var mongoose = require('mongoose');

var likeSchema = mongoose.Schema({
    accountId: String
}, { timestamps: true });
var Like = mongoose.model('Like', likeSchema);
module.exports = Like;
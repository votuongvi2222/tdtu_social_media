var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    accountId: String,
    content: String,
    subCommentIds: [String], // subcomment is also a comment
    likeId: [String], 
}, { timestamps: true });
var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
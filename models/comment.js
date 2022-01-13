var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    accountId: String,
    content: String,
    postId: String, // post id
    subCommentIds: [String], // subcomment is also a comment
    likers: [String], 
}, { timestamps: true });
var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
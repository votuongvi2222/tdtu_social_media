var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    accountId: String, // who posts?
    caption: String,
    likers: [String],  // acc id
    images: [String], // image path
    files: [String], // file path
    links: [String], // link url
    videoLinks: [String], // youtube video link
    commentIds: [String], // list of super comment
}, { timestamps: true });
var Post = mongoose.model('Post', postSchema);
module.exports = Post;
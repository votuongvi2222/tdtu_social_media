var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
    accountId: String, // who posts?
    name: { 
        type: String,
        required: true,
        unique: true
    }, 
}, { timestamps: true });
var Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
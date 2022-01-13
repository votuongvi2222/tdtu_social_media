var Comment = require('../../models/comment'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    Post = require('../../models/post'),
    moment = require('moment'),
    bcrypt = require('bcrypt');

var getComments =  async (req, res) => {
    try {
        const comments = await Comment.find({});
        const commentsInfo = await Promise.all(
            comments.map(async (comment) => {
                const account = await Account.findById(comment.accountId);
                return {
                    id: comment._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId


                    },
                    content: comment.content || '',
                    likers: comment.likers || [],
                    postId: comment.postId || '',
                    subCommentIds: comment.subCommentIds || [],
                    createdTime: moment(comment.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(comment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                }
            }
        ))
        return res.json(commentsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getCommentsByPostId =  async (req, res) => {
    try {
        const comments = await Comment.find({postId: req.params.id});
        const commentsInfo = await Promise.all(
            comments.map(async (comment) => {
                const account = await Account.findById(comment.accountId);
                return {
                    id: comment._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId

                    },
                    content: comment.content || '',
                    likers: comment.likers || [],
                    postId: comment.postId || '',
                    subCommentIds: comment.subCommentIds || [],
                    createdTime: moment(comment.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(comment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                }
            }
        ))
        return res.json(commentsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const account = await Account.findById(comment.accountId);
        return res.json({
            id: comment._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId
            },
            content: comment.content || '',
            likers: comment.likers || [],
            postId: comment.postId || '',
            subCommentIds: comment.subCommentIds || [],
            createdTime: moment(comment.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(comment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const account = await Account.findById(comment.accountId);
        comment.content = req.body.content || '';
        await comment.save();
        return res.json({
            id: comment._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId
            },
            content: comment.content || '',
            likers: comment.likers || [],
            subCommentIds: comment.subCommentIds || [],
            postId: comment.postId || '',
            createdTime: moment(comment.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(comment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postComment = async (req, res) => {
    try {
        const account = await Account.findById(req.body.accountId);
        const comment = new Comment({
            accountId: account._id,
            content: req.body.content || '',
            postId: req.body.postId || '',
        });
        await comment.save();
        return res.json({
            id: comment._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId
            },
            content: comment.content || '',
            likers: comment.likers || [],
            subCommentIds: comment.subCommentIds || [],
            postId: comment.postId || '',
            createdTime: moment(comment.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(comment.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        await comment.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteCommentById: deleteCommentById,
    getCommentById: getCommentById,
    getCommentsByPostId, getCommentsByPostId,
    getComments: getComments,
    putCommentById: putCommentById,
    postComment: postComment
}
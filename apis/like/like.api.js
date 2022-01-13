var Like = require('../../models/like'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    moment = require('moment'),
    bcrypt = require('bcrypt');

var getLikes =  async (req, res) => {
    try {
        const likes = await Like.find({});
        const likesInfo = await Promise.all(
            likes.map(async (like) => {
                const account = await Account.findById(like.accountId);
                return {
                    id: like._id,
                    account: {
                        id: account._id,
                        username: account.username
                    },
                }
            }
        ))
        return res.json(likesInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
var getLikeById = async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);
        const account = await Account.findById(like.accountId);
        return res.json({
            id: like._id,
            account: {
                id: account._id,
                username: account.username
            },
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putLikeById = async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);
        const account = await Account.findById(req.body.accountId);
        like.accountId = account._id;
        await like.save();
        return res.json({
            id: like._id,
            account: {
                id: account._id,
                username: account.username
            },
            createdTime: moment(like.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(like.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postLike = async (req, res) => {
    try {
        const account = await Account.findById(req.body.accountId);
        const like = new Like({
            accountId: account._id,
        });
        await like.save();
        return res.json({
            id: like._id,
            account: {
                id: account._id,
                username: account.username
            },
            createdTime: moment(like.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(like.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteLikeById = async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);
        await like.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteLikeById: deleteLikeById,
    getLikeById: getLikeById,
    getLikes: getLikes,
    putLikeById: putLikeById,
    postLike: postLike
}
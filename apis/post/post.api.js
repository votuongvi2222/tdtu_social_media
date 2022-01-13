var Post = require('../../models/post'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    Comment = require('../../models/comment'),
    moment = require('moment'),
    mongoose = require('mongoose')
    bcrypt = require('bcrypt');

var getPosts =  async (req, res) => {
    try {
        const posts = await Post.find();
        const postsInfo = await Promise.all(
            posts.map(async (post) => {
                const account = await Account.findById(post.accountId);
                // const likersAcc = await Promise.all(
                //     post.likers.map(async (likerId) => {
                //         const likerAcc = await Account.findById(likerId);
                //         return {
                //             id: likerAcc._id,
                //             username: likerAcc.username
                //         }
                //     })
                // )
                return {
                    id: post._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId

                    },
                    caption: post.caption || '',
                    likers:  [],
                    images: post.images || [],
                    videoLinks: post.videoLinks || [],
                    commentIds: post.commentIds || [],
                    createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                }
            }
        ))
        return res.json(postsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getPostsByAccountId =  async (req, res) => {
    try {
        const posts = await Post.find({accountId: req.params.id});
        const postsInfo = await Promise.all(
            posts.map(async (post) => {
                const account = await Account.findById(post.accountId);
                // const likersAcc = await Promise.all(
                //     post.likers.map(async (likerId) => {
                //         const likerAcc = await Account.findById(likerId);
                //         return {
                //             id: likerAcc._id,
                //             username: likerAcc.username,
                //             avatar: likerAcc.avatar

                //         }
                //     })
                // )
                return {
                    id: post._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId

                    },
                    caption: post.caption || '',
                    likers: [],
                    images: post.images || [],
                    videoLinks: post.videoLinks || [],
                    commentIds: post.commentIds || [],
                    createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
                }
            }
        ))
        return res.json(postsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getPostsInRange =  async (req, res) => {
    try {
        const posts = await Post.find({})
                                .sort({'createdAt': -1})
                                .skip(parseInt(req.params.start))
                                .limit(parseInt(req.params.limit));
        console.log(posts)
        console.log(req.params.start)
        const postsInfo = await Promise.all(
            posts.map(async (post) => {
                const account = await Account.findById(post.accountId);
                // const likersAcc = await Promise.all(
                //     post.likers.map(async (likerId) => {
                //         const likerAcc = await Account.findById(likerId);
                //         return {
                //             id: likerAcc._id,
                //             username: likerAcc.username,
                //             avatar: likerAcc.avatar
                //         }
                //     })
                // )
                return {
                    id: post._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId
                    },
                    caption: post.caption || '',
                    likers: [],
                    images: post.images || [],
                    videoLinks: post.videoLinks || [],
                    commentIds: post.commentIds || [],
                    createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
                }
            }
        ))
        return res.json(postsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getPostsByAccountIdInRange =  async (req, res) => {
    try {
        const posts = await Post.find({accountId: req.params.id})
                                .sort({'createdAt': -1})
                                .skip(parseInt(req.params.start))
                                .limit(parseInt(req.params.limit));
        console.log(posts)
        console.log(req.params.start)
        const postsInfo = await Promise.all(
            posts.map(async (post) => {
                const account = await Account.findById(post.accountId);
                // const likersAcc = await Promise.all(
                //     post.likers.map(async (likerId) => {
                //         const likerAcc = await Account.findById(likerId);
                //         return {
                //             id: likerAcc._id,
                //             username: likerAcc.username,
                //             avatar: likerAcc.avatar
                //         }
                //     })
                // )
                return {
                    id: post._id,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar,
                        roleId: account.roleId

                    },
                    caption: post.caption || '',
                    likers: [],
                    images: post.images || [],
                    videoLinks: post.videoLinks || [],
                    commentIds: post.commentIds || [],
                    createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
                }
            }
        ))
        return res.json(postsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const account = await Account.findById(post.accountId);
        // const likersAcc = await Promise.all(
        //     post.likers.map(async (likerId) => {
        //         const likerAcc = await Account.findById(likerId);
        //         return {
        //             id: likerAcc._id,
        //             username: likerAcc.username,
        //             avatar: likerAcc.avatar
        //         }
        //     })
        // )
        return {
            id: post._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId
            },
            caption: post.caption || '',
            likers: [],
            images: [],
            videoLinks: post.videoLinks || [],
            commentIds: [],
            createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const account = await Account.findById(post.accountId);
        post.caption = req.body.caption || '';
        post.videoLinks = req.body.videoLinks || [];
        await post.save();
        return {
            id: post._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId

            },
            caption: post.caption || '',
            likers: post.likers || [],
            images: post.images || [],
            videoLinks: post.videoLinks || [],
            commentIds: post.commentIds || [],
            createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postPost = async (req, res) => {
    try {
        console.log('post')
        const account = await Account.findById(req.body.accountId);
        const post = new Post({
            accountId: account._id,
            caption: req.body.caption || '',
            likers: [],
            images: req.body.images || [],
            videoLinks: req.body.videoLinks || [],
            commentIds: []
        });
        await post.save();
        return res.json({
            id: post._id,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar,
                roleId: account.roleId
            },
            caption: post.caption || '',
            likers: post.likers || [],
            images: post.images || [],
            videoLinks: post.videoLinks || [],
            commentIds: post.commentIds || [],
            createdTime: moment(post.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(post.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deletePostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deletePostById: deletePostById,
    getPostById: getPostById,
    getPostsByAccountId: getPostsByAccountId,
    getPosts: getPosts,
    putPostById: putPostById,
    postPost: postPost,
    getPostsByAccountIdInRange: getPostsByAccountIdInRange,
    getPostsInRange: getPostsInRange
}
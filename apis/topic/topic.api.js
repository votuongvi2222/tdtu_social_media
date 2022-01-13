var Topic = require('../../models/topic'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    moment = require('moment'),
    bcrypt = require('bcrypt');

var getTopics =  async (req, res) => {
    try {
        const topics = await Topic.find({});
        const topicsInfo = await Promise.all(
            topics.map(async (topic) => {
                const account = await Account.findById(topic.accountId);
                return {
                    id: topic._id,
                    name: topic.name || '',
                    account: {
                        id: account._id,
                        username: account.username
                    },
                }
            }
        ))
        return res.json(topicsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var getTopicById = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const account = await Account.findById(topic.accountId);
        return res.json({
            id: topic._id,
            name: topic.name || '',
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

var putTopicById = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const account = await Account.findById(topic.accountId);
        topic.name = req.body.name || '';
        await topic.save();
        return res.json({
            id: topic._id,
            name: topic.name,
            account: {
                id: account._id,
                username: account.username
            },
            createdTime: moment(topic.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(topic.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postTopic = async (req, res) => {
    try {
        const account = await Account.findById(req.body.accountId);
        const topic = new Topic({
            accountId: account._id,
            name: req.body.name
        });
        await topic.save();
        return res.json({
            id: topic._id,
            name: topic.name || '',
            account: {
                id: account._id,
                username: account.username
            },
            createdTime: moment(topic.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(topic.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteTopicById = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        await topic.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteTopicById: deleteTopicById,
    getTopicById: getTopicById,
    getTopics: getTopics,
    putTopicById: putTopicById,
    postTopic: postTopic
}
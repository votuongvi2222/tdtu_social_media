var Account = require('../../models/account'),
    Role = require('../../models/role'),
    bcrypt = require('bcrypt'),
    moment = require('moment');

var getAccounts = (req, res) => {
    Account.find((error, accounts) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        return res.json(accounts.map((account) => {
            return {
                id: account._id,
                username: account.username,
                createdTime: moment(account.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                updatedTime: moment(account.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                role: account.roleId
            }
            // })
        }))
    })
}

var getAccountById = (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!account) return res.send(404, 'Account id is not found!');
        return res.json({
            id: account._id,
            username: account.username,
            createdTime: moment(account.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(account.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
            role: account.roleId
        })
    })
}

var putAccountById = (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!account) return res.send(404, 'Account id is not found!');

        account.username = req.body.username;
        account.hashedPassword = bcrypt.hashSync(req.body.password, 10);
        account.roleId = req.body.roleId;
        account.avatar = req.body.avatar;
        account.save((error, account)  => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            return res.json({
                id: account._id,
                username: account.username,
                createdTime: moment(account.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                updatedTime: moment(account.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                role: account.roleId
            })
        })
    })
}

var postAccount = (req, res) => {

    new Account({
        username: req.body.username,
        hashedPassword: bcrypt.hashSync(req.body.password, 10),
        roleId: req.body.roleId,
    }).save((error, account) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        return res.json({
            id: account._id,
            username: account.username,
            createdTime: moment(account.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(account.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
            role: account.roleId
        })
    })
}

var deleteAccountById = (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!account) return res.send(404, 'Account id is not found!');
        account.delete((error, account)  => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            return res.json({
                id: account._id,
                username: account.username,
                createdTime: moment(account.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                updatedTime: moment(account.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
                role: account.roleId
            })
        })
    })
}

module.exports = {
    deleteAccountById: deleteAccountById,
    getAccountById: getAccountById,
    getAccounts: getAccounts,
    putAccountById: putAccountById,
    postAccount: postAccount
}
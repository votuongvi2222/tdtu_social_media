var Account = require('../../models/account'),
    Role = require('../../models/role'),
    bcrypt = require('bcrypt');

    var getAccounts = (req, res) => {
        Account.find((error, accounts) => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            return res.json(accounts.map((account) => {
                // console.log(account.roleId)
                // Role.findOne({roleCode: account.roleId}, (error, role) => {
                //     if(error) return res.send(500, 'Error occurred: Database error!');
                //     if(!role) return res.send(404, 'Role id is not found!');
                //     console.log(role.roleCode)
                return {
                    id: account._id,
                    username: account.username,
                    createdTime: account.createAt,
                    updatedTime: account.updatedAt, 
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
            createdTime: account.createAt,
            updatedTime: account.updatedAt, 
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
                createdTime: account.createdAt,
                updatedTime: account.updatedAt, 
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
            createdTime: account.createdAt,
            updatedTime: account.updatedAt, 
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
                createdTime: account.createdAt,
                updatedTime: account.updatedAt, 
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
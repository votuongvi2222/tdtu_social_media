var Department = require('../../models/department'),
    Role = require('../../models/role'),
    Account = require('../../models/account'),
    moment = require('moment'),
    bcrypt = require('bcrypt');

var getDepartments =  async (req, res) => {
    try {
        const departments = await Department.find({});
        const departmentsInfo = await Promise.all(
            departments.map(async (department) => {
                const account = await Account.findById(department.accountId);

                return {
                    id: department._id,
                    name: department.name || '',
                    code: department.departmentCode || '',
                    location: department.location || '',
                    email: department.email || '',
                    website: department.website || '',
                    phoneNumber: department.phoneNumber || '',
                    foundedYear: department.foundedYear || 2021,
                    account: {
                        id: account._id,
                        username: account.username,
                        avatar: account.avatar
                    },
                    reposibilities: department.reposibilities || '',
                }
            }
        ))
        return res.json(departmentsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
var getDepartmentById = async (req, res) => {
    try {
        console.log('api')
        console.log(req.params.id)
        const department = await Department.findById(req.params.id);
        const account = await Account.findById(department.accountId);
        return res.json({
            id: department._id,
            name: department.name || '',
            code: department.departmentCode || '',
            location: department.location,
            email: department.email,
            website: department.website,
            phoneNumber: department.phoneNumber,
            foundedYear: department.foundedYear,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar
            },
            reposibilities: department.reposibilities || '',
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        const account = await Account.findById(req.body.accountId);
        department.accountId = account._id || department.accountId;
        await department.save();
        return res.json({
            id: department._id,
            name: department.name || '',
            code: department.departmentCode || '',
            location: department.location,
            email: department.email,
            website: department.website,
            phoneNumber: department.phoneNumber,
            foundedYear: department.foundedYear,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar
            },
            reposibilities: department.reposibilities || '',
            createdTime: moment(department.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(department.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postDepartment = async (req, res) => {
    try {
        const account = await Account.findById(req.body.accountId);
        const department = new Department({
            name: req.body.name || '',
            departmentCode: req.body.code || '',
            location: req.body.location || '',
            email: req.body.email || '',
            website: req.body.website || '',
            phoneNumber: req.body.phoneNumber || '',
            foundedYear: req.body.foundedYear || parseInt(new Date().getFullYear),
            accountId: account._id,
            reposibilities: req.body.reposibilities,
        });
        await department.save();
        return res.json({
            id: department._id,
            name: department.name || '',
            code: department.departmentCode || '',
            location: department.location,
            email: department.email,
            website: department.website,
            phoneNumber: department.phoneNumber,
            foundedYear: department.foundedYear,
            account: {
                id: account._id,
                username: account.username,
                avatar: account.avatar
            },
            reposibilities: department.reposibilities || '',
            createdTime: moment(department.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(department.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        await department.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteDepartmentById: deleteDepartmentById,
    getDepartmentById: getDepartmentById,
    getDepartments: getDepartments,
    putDepartmentById: putDepartmentById,
    postDepartment: postDepartment
}
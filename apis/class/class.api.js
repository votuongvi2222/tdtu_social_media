var Cls = require('../../models/class'),
    Role = require('../../models/role'),
    Department = require('../../models/department'),
    Account = require('../../models/account'),
    moment = require('moment'),
    bcrypt = require('bcrypt');

var getClses =  async (req, res) => {
    try {
        const clses = await Cls.find({});
        const clsesInfo = await Promise.all(
            clses.map(async (cls) => {
                const faculty = await Department.findOne({departmentCode: cls.facultyCode})
                return {
                    id: cls._id,
                    classId: cls.classId || '',
                    faculty: faculty, // department code
                    schoolYear: cls.schoolYear || 2019, // the year start
                }
            }
        ))
        return res.json(clsesInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
var getClsById = async (req, res) => {
    try {
        const cls = await Cls.findById(req.params.id);
        const faculty = await Department.findOne({departmentCode: cls.facultyCode})
        return res.json({
            id: cls._id,
            classId: cls.classId || '',
            faculty: faculty, // department code
            schoolYear: cls.schoolYear || 2019, // the year start
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putClsById = async (req, res) => {
    try {
        const cls = await Cls.findById(req.params.id);
        const faculty = await Department.findOne({departmentCode: req.body.facultyCode});
        cls.classId = req.body.classId || cls.classId;
        cls.program = req.body.program || cls.program;
        cls.facultyCode = faculty.departmentCode || cls.facultyCode;
        await cls.save()
        return res.json({
            id: cls._id,
            classId: cls.classId,
            faculty: faculty, // department code
            schoolYear: cls.schoolYear, // the year start
            createdTime: moment(cls.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(cls.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postCls = async (req, res) => {
    try {
        const faculty = await Department.findOne({departmentCode: req.body.facultyCode});
        const cls = new Cls({
            classId: req.body.classId || '',
            facultyCode: faculty.departmentCode || '', // department code
            schoolYear: req.body.schoolYear || 2019, // the year start
        });
        await cls.save();
        return res.json({
            id: cls._id,
            classId: cls.classId,
            faculty: faculty, // department code
            schoolYear: cls.schoolYear, // the year start
            createdTime: moment(cls.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(cls.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteClsById = async (req, res) => {
    try {
        const cls = await Cls.findById(req.params.id);
        await cls.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteClsById: deleteClsById,
    getClsById: getClsById,
    getClses: getClses,
    putClsById: putClsById,
    postCls: postCls
}
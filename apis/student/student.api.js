var Student = require('../../models/student'),
    Role = require('../../models/role'),
    Department = require('../../models/department'),
    Account = require('../../models/account'),
    bcrypt = require('bcrypt');

var getStudents =  async (req, res) => {
    try {
        const students = await Student.find({});
        const studentsInfo = await Promise.all(
            students.map(async (student) => {
                const faculty = await Department.findOne({departmentCode: student.facultyCode})
                const account = await Account.findById(student.accountId);

                return {
                    id: student._id,
                    googleId: student.googleId,// gg id
                    fullname: student.fullname, // gg displayname
                    studentId: student.studentId,
                    studentEmail: student.studentEmail, // gg email
                    classId: student.classId || '',
                    faculty: faculty.name, // department code
                    birthday: student.birthday || '', // gg birthdate
                    account: {
                        id: account._id,
                        username: account.username
                    },
                    gender: student.gender || '', // gg gender
                    avatar: student.avatar || '', // gg coverPhoto
                    schoolYear: student.schoolYear, // the year start
                    program: student.program, // high quaity or standar
                    phoneNumber: student.phoneNumber || '',
                    address: student.address || '', // gg places lived
                    hometown: student.hometown || '',
                    relatives: student.relatives || []
                }
            }
        ))
        return res.json(studentsInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
var getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const faculty = await Department.findOne({departmentCode: student.facultyCode})
        const account = await Account.findById(student.accountId);
        return res.json({
            id: student._id,
            googleId: student.googleId,// gg id
            fullname: student.fullname, // gg displayname
            studentId: student.studentId,
            studentEmail: student.studentEmail, // gg email
            classId: student.classId || '',
            faculty: faculty.name, // department code
            birthday: student.birthday || '', // gg birthdate
            account: {
                id: account._id,
                username: account.username
            },
            gender: student.gender || '', // gg gender
            avatar: student.avatar || '', // gg coverPhoto
            schoolYear: student.schoolYear, // the year start
            program: student.program, // high quaity or standar
            phoneNumber: student.phoneNumber || '',
            address: student.address || '', // gg places lived
            hometown: student.hometown || '',
            relatives: student.relatives || []
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var putStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const faculty = await Department.findOne({departmentCode: req.body.facultyCode});
        const account = await Account.findById(req.body.accountId);
        student.fullname = req.body.fullname || '';
        student.studentId = req.body.studentId || '';
        student.studentEmail = req.body.studentEmail || '';
        student.birthday = req.body.birthday || '';
        student.classId = req.body.classId || '';
        student.accountId = account._id;
        student.gender = req.body.gender || '';
        student.avatar = req.body.avatar || '';
        student.schoolYear = req.body.schoolYear || '';
        student.program = req.body.program || '';
        student.phoneNumber = req.body.phoneNumber || '';
        student.address = req.body.address || '';
        student.hometown = req.body.hometown || '';
        student.relatives = req.body.relatives || [];
        student.facultyCode = faculty.departmentCode;
        return res.json({
            id: student._id,
            googleId: student.googleId,// gg id
            fullname: student.fullname, // gg displayname
            studentId: student.studentId,
            studentEmail: student.studentEmail, // gg email
            class: student.classId,
            faculty: faculty.name, // department code
            birthday: student.birthday, // gg birthdate
            account: {
                id: account._id,
                username: account.username
            },
            gender: student.gender, // gg gender
            avatar: student.avatar, // gg coverPhoto
            schoolYear: student.schoolYear, // the year start
            program: student.program, // high quaity or standar
            phoneNumber: student.phoneNumber,
            address: student.address, // gg places lived
            hometown: student.hometown,
            relatives: student.relatives,
            createdTime: moment(student.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(student.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var postStudent = async (req, res) => {
    try {
        const faculty = await Department.findOne({departmentCode: req.body.facultyCode});
        const account = await Account.findById(req.body.accountId);
        const student = new Student({
            googleId: req.body.googleId,// gg id
            fullname: req.body.fullname, // gg displayname
            studentId: req.body.studentId,
            studentEmail: req.body.studentEmail, // gg email
            classId: req.body.classId,
            facultyCode: faculty.departmentCode, // department code
            birthday: req.body.birthday, // gg birthdate
            accountId: account._id,
            gender: req.body.gender, // gg gender
            avatar: req.body.avatar, // gg coverPhoto
            schoolYear: req.body.schoolYear, // the year start
            program: req.body.program, // high quaity or standar
            phoneNumber: req.body.phoneNumber,
            address: req.body.address, // gg places lived
            hometown: req.body.hometown,
            relatives: req.body.relatives,
        });
        await student.save();
        return res.json({
            id: student._id,
            googleId: student.googleId,// gg id
            fullname: student.fullname, // gg displayname
            studentId: student.studentId,
            studentEmail: student.studentEmail, // gg email
            class: student.classId,
            faculty: faculty.name, // department code
            birthday: student.birthday, // gg birthdate
            account: {
                id: account._id,
                username: account.username
            },
            gender: student.gender, // gg gender
            avatar: student.avatar, // gg coverPhoto
            schoolYear: student.schoolYear, // the year start
            program: student.program, // high quaity or standar
            phoneNumber: student.phoneNumber,
            address: student.address, // gg places lived
            hometown: student.hometown,
            relatives: student.relatives,
            createdTime: moment(student.createAt).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            updatedTime: moment(student.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"), 
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

var deleteStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        await student.delete()
        return res.json('Deleted!')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteStudentById: deleteStudentById,
    getStudentById: getStudentById,
    getStudents: getStudents,
    putStudentById: putStudentById,
    postStudent: postStudent
}
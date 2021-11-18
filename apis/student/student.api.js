var Student = require('../../models/student'),
    Role = require('../../models/role'),
    bcrypt = require('bcrypt');

var getStudents = (req, res) => {
    Student.find((error, students) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        return res.json(students.map((student) => {
            Role.findById(student.roleId, (error, role) => {
                if(error) return res.send(500, 'Error occurred: Database error!');
                if(!role) return res.send(404, 'Role id is not found!');
                return res.json({
                    id: student._id,
                    username: student.username,
                    createdTime: student.createAt,
                    updatedTime: student.updatedAt, 
                    role: {
                        id: role._id,
                        name: role.name
                    },
                    avatar: student.avatar
                })
            })
        }))
    })
}

var getStudentById = (req, res) => {
    Student.findById(req.params.id, (error, student) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!student) return res.send(404, 'Student id is not found!');
        Role.findById(student.roleId, (error, role) => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            if(!role) return res.send(404, 'Role id is not found!');
            return res.json({
                id: student._id,
                username: student.username,
                createdTime: student.createAt,
                updatedTime: student.updatedAt, 
                role: {
                    id: role._id,
                    name: role.name
                },
                avatar: student.avatar
            })
        })
    })
}

var putStudentById = (req, res) => {
    Student.findById(req.params.id, (error, student) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!student) return res.send(404, 'Student id is not found!');
        Role.findById(req.body.roleId, (error, role) => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            if(!role) return res.send(404, 'Role id is not found!');
            student.username = req.body.username;
            student.hashedPassword = bcrypt.hashSync(req.body.password, 10);
            student.roleId = req.body.roleId;
            student.avatar = req.body.avatar;
            student.save((error, student)  => {
                if(error) return res.send(500, 'Error occurred: Database error!');
                return res.json({
                    id: student._id,
                    username: student.username,
                    createdTime: student.createAt,
                    updatedTime: student.updatedAt, 
                    role: {
                        id: role._id,
                        name: role.name
                    },
                    avatar: student.avatar
                })
            })
        })
    })
}

var postStudent = (req, res) => {
    Role.findById(req.body.roleId, (error, role) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!role) return res.send(404, 'Role id is not found!');
        new Student({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, 10),
            roleId: req.body.roleId,
            avatar: req.body.avatar
        }).save((error, student) => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            return res.json({
                id: student._id,
                username: student.username,
                createdTime: student.createAt,
                updatedTime: student.updatedAt, 
                role: {
                    id: role._id,
                    name: role.name
                },
                avatar: student.avatar
            })
        })
    })
}

var deleteStudentById = (req, res) => {
    Student.findById(req.params.id, (error, student) => {
        if(error) return res.send(500, 'Error occurred: Database error!');
        if(!student) return res.send(404, 'Student id is not found!');
        Role.findById(req.body.roleId, (error, role) => {
            if(error) return res.send(500, 'Error occurred: Database error!');
            if(!role) return res.send(404, 'Role id is not found!');
            student.delete((error, student)  => {
                if(error) return res.send(500, 'Error occurred: Database error!');
                return res.json({
                    id: student._id,
                    username: student.username,
                    createdTime: student.createAt,
                    updatedTime: student.updatedAt, 
                    role: {
                        id: role._id,
                        name: role.name
                    },
                    avatar: student.avatar
                })
            })
        })
    })
}

module.exports = {
    deleteStudentById: deleteStudentById,
    getStudentById: getStudentById,
    getStudents: getStudents,
    putStudentById: putStudentById,
    postStudent: postStudent
}
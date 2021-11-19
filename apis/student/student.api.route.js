var express = require('express');
var router = express.Router();
var studentApis = require('./student.api')
/* GET home page. */
router.get('/students', studentApis.getStudents);
router.get('/student/:id', studentApis.getStudentById);
router.post('/student', studentApis.postStudent);
router.put('/student/:id', studentApis.putStudentById);
router.delete('/student/:id', studentApis.deleteStudentById);

module.exports = router;
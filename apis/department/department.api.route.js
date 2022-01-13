var express = require('express');
var router = express.Router();
var departmentApis = require('./department.api')
/* GET home page. */
router.get('/departments', departmentApis.getDepartments);
router.get('/department/:id', departmentApis.getDepartmentById);
router.post('/department', departmentApis.postDepartment);
router.put('/department/:id', departmentApis.putDepartmentById);
router.delete('/department/:id', departmentApis.deleteDepartmentById);

module.exports = router;
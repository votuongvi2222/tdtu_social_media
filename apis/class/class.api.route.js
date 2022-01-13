var express = require('express');
var router = express.Router();
var clsApis = require('./class.api')
/* GET home page. */
router.get('/clses', clsApis.getClses);
router.get('/cls/:id', clsApis.getClsById);
router.post('/cls', clsApis.postCls);
router.put('/cls/:id', clsApis.putClsById);
router.delete('/cls/:id', clsApis.deleteClsById);

module.exports = router;
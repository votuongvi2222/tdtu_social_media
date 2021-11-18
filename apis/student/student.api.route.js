var express = require('express');
var router = express.Router();
var accountApis = require('./account.api')
/* GET home page. */
router.get('/accounts', accountApis.getAccounts);
router.get('/account/:id', accountApis.getAccountById);
router.post('/account', accountApis.postAccount);
router.put('/account/:id', accountApis.putAccountById);
router.delete('/account/:id', accountApis.deleteAccountById);

module.exports = router;
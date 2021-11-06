var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'home' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});
router.get('/add', function(req, res, next) {
  res.render('post-form', { title: 'add' });
});
// router.get('/', function(req, res, next) {
//   res.render('home', { title: 'home' });
// });

module.exports = router;

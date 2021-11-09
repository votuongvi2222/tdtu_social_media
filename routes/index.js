var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/add', function(req, res, next) {
  res.render('post-form', { title: 'Notification form' });
});
router.get('/about', function(req, res, next) {
  res.render('howitworks', { title: 'How it works' });
});
router.get('/noti', function(req, res, next) {
  res.render('class', { title: 'Notification' });
});
module.exports = router;

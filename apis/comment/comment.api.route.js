var express = require('express');
var router = express.Router();
var commentApis = require('./comment.api')
/* GET home page. */
router.get('/comments', commentApis.getComments);
router.get('/comment/:id', commentApis.getCommentById);
router.get('/comments/post/:id', commentApis.getCommentsByPostId);
router.post('/comment', commentApis.postComment);
router.put('/comment/:id', commentApis.putCommentById);
router.delete('/comment/:id', commentApis.deleteCommentById);

module.exports = router;
var express = require('express');
var router = express.Router();
var postApis = require('./post.api')
/* GET home page. */
router.get('/posts', postApis.getPosts);
router.get('/post/:id', postApis.getPostById);
router.get('/posts/:start/:limit', postApis.getPostsInRange);
router.get('/posts/acc/:id/:start/:limit', postApis.getPostsByAccountIdInRange);
router.get('/posts/acc/:id', postApis.getPostsByAccountId);
router.post('/post', postApis.postPost);
router.put('/post/:id', postApis.putPostById);
router.delete('/post/:id', postApis.deletePostById);

module.exports = router;
var express = require('express');
var router = express.Router();
var likeApis = require('./like.api')
/* GET home page. */
router.get('/likes', likeApis.getLikes);
router.get('/like/:id', likeApis.getLikeById);
router.post('/like', likeApis.postLike);
router.put('/like/:id', likeApis.putLikeById);
router.delete('/like/:id', likeApis.deleteLikeById);

module.exports = router;
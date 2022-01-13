var express = require('express');
var router = express.Router();
var topicApis = require('./topic.api')
/* GET home page. */
router.get('/topics', topicApis.getTopics);
router.get('/topic/:id', topicApis.getTopicById);
router.post('/topic', topicApis.postTopic);
router.put('/topic/:id', topicApis.putTopicById);
router.delete('/topic/:id', topicApis.deleteTopicById);

module.exports = router;
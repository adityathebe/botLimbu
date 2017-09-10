var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("Hello world, I am a chat bot");
});

module.exports = router;
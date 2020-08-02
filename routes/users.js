var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('yes it is working don\'t worry');
});

module.exports = router;
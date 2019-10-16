var express = require('express');
var router = express.Router();
var auth = require('./middleware/authentication');

/* GET home page. */
router.post('/', auth, function (req, res, next) {
    return res.status(200).json({
        'authorized': true,
        'username': res.locals.decoded.username,
    })
});

module.exports = router;
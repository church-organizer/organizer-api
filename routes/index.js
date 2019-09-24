var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    console.log("hjere i am");
    res.json({
        ok: true
    });
});

module.exports = router;
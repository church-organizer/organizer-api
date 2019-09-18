var express = require('express');
var router = express.Router();
const fs = require('fs');

const imagedir = "./public/images/";


router.get('/:imagename', function (req, res) {
    console.log(req.query);
    var img = fs.readFileSync(imagedir + req.query.imagename);
    res.header("Content-Type", "image/png");
    res.end(img, 'binary')
});


module.exports = router;

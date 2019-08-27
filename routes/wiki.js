var express = require('express');
var router = express.Router();
const fs = require('fs');

const wikiPath = "./public/markdown/wiki";

router.get('/', function (req, res) {
    res.json({ok: true});
});


/* GET home page. */
router.get('/file', function (req, res) {
    let page;
    if (!req.query.page) {
        page = "/start";
    } else {
        page = req.query.page.toLowerCase();
    }
    fs.readFile(wikiPath + page + '.md', "utf-8", (err, data) => {
        if (!err) {
            return res.json({ok: true, content: data});
        }
        console.log(err);
        res.statusCode = 400;
        return res.json({ok: false, content: err});
    });

});


router.get('/structure', function (req, res) {
    let structure = {};
    fs.readdir(wikiPath, (error, files) => {
        if (!error) {
            for (let item of files) {
                let stat = fs.lstatSync(wikiPath + "/" + item);
                if (stat.isDirectory()) {
                    let pages = fs.readdirSync(wikiPath + "/" + item);
                    console.log(pages);
                    structure[item] = pages;
                }
            }
        } else {
            console.log(error);
        }
        return res.json({ok: true, structure: structure});
    });


});


module.exports = router;


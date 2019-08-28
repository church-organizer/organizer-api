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
    if (!req.query.page || req.query.page === "/") {
        page = "/start";
    } else {
        page = req.query.page.toLowerCase();
    }
    const content = readFromFile(wikiPath + page + '.md');
    if (content !== "") {
        return res.json({ok: true, content: content});
    }
    res.statusCode = 400;
    return res.json({ok: false, content: "Keine Passende Datei gefunden."});
});


router.get('/structure', function (req, res) {
    let structure = {};
    fs.readdir(wikiPath, (error, files) => {
        if (!error) {
            for (let item of files) {
                if (isDir(wikiPath + "/" + item)) {
                    let pages = fs.readdirSync(wikiPath + "/" + item);
                    for (let i = 0; i < pages.length; i++) {
                        pages[i] = removeFileEnding(capitalize(pages[i]));
                    }
                    structure[capitalize(item)] = pages;
                }
            }
        } else {
            console.log(error);
        }
        return res.json({ok: true, structure: structure});
    });


});

const readFromFile = (path) => {
    if (isFile(path)) {
        return fs.readFileSync(path, "utf-8");
    }
    return "";
};

const capitalize = (input) => {
    input = input[0].toUpperCase() + input.slice(1);
    return input;
};

const removeFileEnding = (input) => {
    const parts = input.split(".");
    parts.pop();
    return parts.toString();
};

const isFile = (path) => {
    return fs.existsSync(path) && (fs.lstatSync(path)).isFile()
};
const isDir = (path) => {
    return fs.existsSync(path) && (fs.lstatSync(path)).isDirectory()
};


module.exports = router;


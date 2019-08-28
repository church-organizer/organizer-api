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
    if (isDir(wikiPath + page)){
        return res.json({ok: true, content: folderContent(page)});
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

const folderContent= (folder) => {
    let links = "";
    const files = getFilesFromDir(wikiPath  + folder);
    folder = capitalize(folder.slice(1));
    for (let item of files) {
        let name = removeFileEnding(capitalize(item));
        links += `- [${name}](${"/" + folder + "/" + name})\n\n`
    }
    return `# ${folder}\nHier sind die Unterverzeichnisse\n\n\n${links}`;
};

const getFilesFromDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.filter(file => isFile(dir + "/" + file));
    console.log(files);
    return files;
};

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


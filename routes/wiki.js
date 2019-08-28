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
        return res.json({ok: true, content: folderContentLinks(page)});
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
    const dir = getContentFromDir(wikiPath, isDir);
    for(let folder of dir) {
        let folderName = capitalize(folder);
        structure[folderName] = getContentFromDir(wikiPath + "/" + folder);
        structure[folderName] = structure[folderName].map(item => capitalize(removeFileEnding(item)));
    }
    return res.json({ok: true, structure: structure});


});

const folderContentLinks= (folder) => {
    let links = "";
    const files = getContentFromDir(wikiPath  + folder);
    folder = capitalize(folder.slice(1));
    for (let item of files) {
        let name = removeFileEnding(capitalize(item));
        links += `- [${name}](${"/" + folder + "/" + name})\n\n`
    }
    return `# ${folder}\nHier sind die Unterverzeichnisse\n\n\n${links}`;
};

const getContentFromDir = (dir, check=isFile) => {
    let files = fs.readdirSync(dir);
    return files.filter(file => check(dir + "/" + file));
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


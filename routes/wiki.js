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

router.post("/search", function (req, res) {
    if (req.params.searchWord !== null) {
        const result = searchInFiles(req.params.searchWord);
        return res.json({ok: true, result: result});
    } else {
        res.statusCode = 400;
        return res.json({ok: false, body: "nichts zum suchen angegeben"});
    }
});

router.get("/search", function (req, res) {
    if (req.query.input !== null && req.query.input !== "") {
        let startDate = new Date();
        const result = searchInFiles(req.query.input);
        return res.json({ok: true, result: result, time: (new Date().getTime() - startDate.getTime()) / 1000});
    } else {
        return res.json({ok: true, result: {}});
    }
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

const searchInFiles = (input) => {
    const content = getContentFromDir(wikiPath, (input) => true); // get all content
    let result = {};

    const search = (path) => {
        const fileContent = readFromFile(path);
        path = removeFileEnding(path.replace(wikiPath, ""));
        const pathParts = path.split("/");
        const fileName = capitalize(pathParts[pathParts.length-1]);
        if (fileContent.match(input)) {
            result[fileName] = [path, fileContent];
        }
    };

    for (let item of content) {
        if (isFile(wikiPath + "/" + item)) {
            search(wikiPath + "/" + item);
        } else if (isDir(wikiPath + "/" + item)){
            let folderContent = getContentFromDir(wikiPath + "/" + item, isFile);
            for (let file of folderContent){
                search(wikiPath + "/" + item + "/" + file);
            }
        }
    }
    return result;
};

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


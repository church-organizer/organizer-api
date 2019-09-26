var express = require('express');
var router = express.Router();
const fs = require('fs');

const wikiPath = "./files/markdown/wiki";

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
    let searchWord = req.body.searchWord;
    if (searchWord !== null) {
        const result = searchInFiles(searchWord);
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

router.post("/save", function (req, res) {
    const filename = req.body.filename;
    const content = req.body.content;
    if (filename && content) {
        if (saveFile(filename.toLowerCase(), content)) {
            return res.json({ok: true});
        }
        res.statusCode = 400;
        return res.json({ok: false, body: "Konnte die Datei nicht speichern"});
    } else {
        res.statusCode = 400;
        return res.json({ok: false, body: "Nicht alle Daten sind da"});
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

const saveFile = (pathToFile, content) => {
    const path = wikiPath + pathToFile + ".md";
    if (isFile(path)) {
        fs.writeFileSync(path, content);
        return true;
    }
    return false;
};

const searchInFiles = (input) => {
    const content = getContentFromDir(wikiPath, (input) => true); // get all content
    let result = {};

    const search = (path) => {
        const fileContent = readFromFile(path);
        const regex = new RegExp(input, "gi");
        const matches = fileContent.match(regex);
        if (matches === null){
            return
        }

        let start = 0;
        let matchedContent= "";

        for (let match of matches) {
            let index = fileContent.indexOf(match, start);
            let startIndex = index > 25? index-25 : 0;
            let endIndex = index > fileContent.length -25 ? fileContent.length : index + input.length + 25;
            matchedContent += "\n..." + fileContent.slice(startIndex,  endIndex) + "...\n";
            start = index + input.length;
        }
        path = removeFileEnding(path.replace(wikiPath, ""));
        const pathParts = path.split("/");
        const fileName = capitalize(pathParts[pathParts.length-1]);
        result[path] = [fileName, matchedContent];


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


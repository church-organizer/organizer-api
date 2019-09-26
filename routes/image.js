var express = require('express');
var router = express.Router();
const fs = require('fs');
var multer = require('multer');

const accepedMimeTypes = ["image/gif", "image/jpeg", "image/jpg", "image/png"];
const path = "./files/images";

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path);
    },
    filename: function (req, file, callback) {
        const filename = file.originalname;
        callback(null, filename);
    }
});


var upload = multer({
    storage: Storage,
    fileFilter(req, file, callback) {
        if (accepedMimeTypes.indexOf(file.mimetype) >= 0) {
            callback(null, true);
        } else {
            req.fileValidationError = 'Wrong mimetype';
            callback(new Error('Wrong mimetype'), false);
        }
    }
}).array("image", 1); //Field name and max count


router.post("/", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ok: false, message: err});
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ok: false, message: "kein Bild gefunden"});
        }
        return res.json({ok: true})
    })
});

router.get("/:name", function (req, res) {
    const filename = req.params.name;
    try {
        const file = fs.readFileSync(path + "/" + filename);
        let type = filename.split(".");
        type = type[type.length];
        res.header({'Content-Type': 'image/' + type,});
        return res.send(file);
    } catch (e) {
        return res.status(404).json({ok: false, message: "Datei nicht gefunden."});
    }

});

router.get("/all", function (req, res) {

});


module.exports = router;

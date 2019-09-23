var express = require('express');
var router = express.Router();

router.post("/", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (password && username) {

    } else {
        res.statusCode = 400;
        return res.json({ok: false, body: "Die Login Daten sind nicht vollständig."});
    }
});

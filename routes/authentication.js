import User from "../db/user";

var express = require('express');
var router = express.Router();

router.post("/", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (password && username) {
        const success = authenticate();
        if (success) {
            return res.json({ok: true});
        } else {
            return res.json({ok: false});
        }
    } else {
        res.statusCode = 400;
        return res.json({ok: false, body: "Die Login Daten sind nicht vollständig."});
    }
});

router.post("/", function (req, res) {

});


function authenticate(username, password) {
    return User.findOne({where: {username: username}}).then(result => {
        console.log(result);
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    })
}
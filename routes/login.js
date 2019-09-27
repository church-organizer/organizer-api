var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;
const hashed = process.env.HASHED_PWD;

function makeAccessToken(username) {
    var payload = {
        username: username
    }
    var signOptions = {
        expiresIn: '1d'
    }
    // expires in 24 hours
    return jwt.sign(payload, secret, signOptions);
}

/* GET home page. */
router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const match = bcrypt.compareSync(password, hashed);

    if (match) {
        const token = makeAccessToken(username);
        return res.status(200).json({
            'username': username,
            'jwt': token
        })
    } else {
        return res.status(401).send("Wrong name or password");
    }
});

module.exports = router;
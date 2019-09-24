var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;
const hashed = process.env.HASHED_PWD;

function makeAccessToken(name) {
    // expires in 24 hours
    return jwt.sign({
        user: name
    }, secret, {
        expiresIn: '1d'
    });
}

function verifyAccessToken(accessToken) {
    jwt.verify(accessToken, secret, (err, decoded) => {
        if (err) {
            return false
        }
        return true;
    });
}

/* GET home page. */
router.post('/', function (req, res, next) {
    const name = req.body.name;
    const password = req.body.password;
    const match = bcrypt.compareSync(password, hashed);

    if (match) {
        res.locals.accessToken = makeAccessToken(name);
        next();
    }
});

/* return new token */
router.post('/', function (req, res) {
    res.status(200).json({
        'user': req.body.name,
        'access-token': res.locals.accessToken
    })
});

module.exports = router;
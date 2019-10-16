const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).send("Access denied. No Token.");
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(400).send("Access denien. Invalid Token.");
        }
        res.locals.decoded = decoded;
        next();
    });
}
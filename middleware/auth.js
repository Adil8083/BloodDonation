const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function (req, res, next) {
    const token = req.header("authToken");
    if (!token) return res.status(401).send("Access denied invalid token");
    jwt.verify(token, config.get("ACCESS_TOKEN"), async (err) => {
        if (err) return res.status(401).send("Token Expires");
        const decode = jwt.verify(token, config.get("ACCESS_TOKEN"));
        req.body = decode;

        next();
    })
}
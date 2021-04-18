const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    //const token = req.cookies.jwt
    const token = req.headers["auth-token"]
    if (!token) return res.status(401).send('Access Denied');
    else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next()
        } catch (error) {
            res.status(401).send('Invalid Token');
        }
    }
}
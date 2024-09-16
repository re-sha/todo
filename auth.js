const jwt = require("jsonwebtoken")
const JWT_SECRET = "sdfzui23232e%#@";

function auth(req, res, next) {
    const token = req.headers.authorization;
    try {
        const verified = jwt.verify(token,JWT_SECRET);
        req.userId = verified.id;
        next();
    }
    catch (error){
        res.status(403).json("Unauthori zed user")
    }
}

module.exports = {
    auth,
    JWT_SECRET
}


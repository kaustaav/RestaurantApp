const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function auth(req,res,next) {
    const token = req.header('Authorization');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token, keys.secretOrKey);
        req.account = verified;
        next();
    } catch {
        res.status(400).send('Invalid token');
    }
}
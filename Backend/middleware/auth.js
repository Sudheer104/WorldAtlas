const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const config = process.env;

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({
            success: false,
            msg: 'Token is required for authentication'
        });
    }

    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        const blacklistedToken = await Blacklist.findOne({ token: bearerToken }); // ✅ await added

        if (blacklistedToken) {
            return res.status(400).json({
                success: false,
                msg: 'This session has expired please try again'
            });
        }

        const decodeData = jwt.verify(bearerToken, config.ACCESS_TOKEN_SECRET);
        req.user = decodeData; // ✅ will now be available in your route

        next(); // ✅ Continue to route

    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid Token'
        });
    }
};

module.exports = verifyToken;

require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SALT;
const algorithm = process.env.JWT_ALG;

const option = { algorithm };

function createToken(payload) {
    return jwt.sign(payload, secretKey, option);
}

function decodePayload(token) {
    return jwt.verify(token, secretKey);
}

module.exports = { createToken, decodePayload };


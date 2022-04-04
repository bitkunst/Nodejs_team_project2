const { decodePayload } = require('../utils/jwt.js')
exports.loginAuth = (req, res, next) => {
    const token = req.cookies.AccessToken;
    try {
        if (token) {
            const { userid, nickname } = decodePayload(token)
            const userInfo = {
                userid,
                nickname
            }

            req.userInfo = userInfo
            next()
        } else {
            next()
        }
    } catch (err) {
        res.clearCookie('AccessToken')
        next()
    }
};
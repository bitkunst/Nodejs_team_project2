const { alertmove } = require('../utils/alertmove.js')
const { decodePayload } = require('../utils/jwt.js')
exports.auth = (req, res, next) => {
    const token = req.cookies.AccessToken;
    try {
        const { userid, nickname } = decodePayload(token)
        const userInfo = {
            userid,
            nickname
        }

        req.userInfo = userInfo
        next()
    } catch (e) {
        res.send(alertmove('/user/login', '로그인 후 이용해 주세요'))
        console.log(e.message);
    }
};

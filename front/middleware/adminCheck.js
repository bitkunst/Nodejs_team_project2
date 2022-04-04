const { alertmove } = require('../utils/alertmove.js')
exports.adminCheck = (req, res, next) => {
    try {
        if (req.userInfo.userid === 'admin') {
            next()
        } else {
            res.send(alertmove('/', '관리자만 접근 가능합니다.'))
        }
    } catch (e) {
        res.send(alertmove('/user/login', '로그인 후 이용해 주세요'))
        console.log(e.message);
    }
};

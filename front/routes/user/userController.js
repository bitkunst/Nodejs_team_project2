const { decodePayload } = require('../../utils/jwt.js')

exports.login = (req, res) => {
    res.render('user/login.html');
};

exports.join = (req, res) => {
    res.render('user/join.html');
};

exports.welcome = (req, res) => {
    res.render('user/welcome.html');
};

exports.agree = (req, res) => {
    res.render('user/agree.html');
};

exports.profile = async (req, res) => {
    const token = req.cookies.AccessToken
    const { userid, nickname } = decodePayload(token)
    // 백서버로 요청을 보내고 사용자 정보를 가져오기 
    // const response = awiat axios.post()
    // res.render('user/profile.html', {
    //     userid,
    //     nickname
    // });
};

exports.profileEdit = (req, res) => {
    res.render('user/update.html');
};
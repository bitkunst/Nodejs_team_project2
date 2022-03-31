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
    // To 종남
    // req 객체 안에 사용자 정보 넣어서 userInfo 객체 만듦!!
    // 확인하고 작업할 것!! 
    // console.log(req.userInfo)
    const {userid, nickname} = req.userInfo
    // 백서버로 요청을 보내고 사용자 정보를 가져오기 
    // const response = awiat axios.post()
    res.render('user/profile.html', {
        userid,
        nickname
    });
};

exports.profileBoard = async (req, res) => {
    // console.log(req.userInfo)
    // 1. axios 써서 req.userInfo에 있는 사용자 정보를 back 으로 보냄
    // 2. back에서는 받은 사용자 정보를 가지고 DB에 데이터 요청
    //    back에서 DB로부터 받은 정보를 front로 보냄 (res.json) 
    // const result = response.data
    // 3. back으로부터 받은 정보를 (response.data) 가지고 브라우저에 화면 render
    // const result = response.data
    res.render('user/profileBoard.html')
}

exports.profileEdit = (req, res) => {
    res.render('user/update.html');
};
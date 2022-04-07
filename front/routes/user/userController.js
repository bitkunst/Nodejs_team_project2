const { default: axios } = require('axios')
const { alertmove } = require('../../utils/alertmove.js');



exports.login = (req, res) => {
    res.render('user/login.html');
};


exports.logout = (req, res) => {
    res.clearCookie('AccessToken');
    res.send(alertmove('http://localhost:3001', '로그아웃 되었습니다.'));
}


exports.join = (req, res) => {
    res.render('user/join.html');
};

exports.welcome = (req, res) => {
    const nickname = req.userInfo.nickname
    console.log(req.userInfo.nickname)
    if (req.userInfo.nickname == undefined) {
        res.send(alertmove('/', '회원가입 환영페이지 입니다.'));
    } else {
        res.render('user/welcome.html', { nickname });
    }
};

exports.agree = (req, res) => {
    res.render('user/agree.html');
};

exports.profile = async (req, res) => {

    const option = {
        'Content-type': 'application/json',
        withCredentials: true,
    }
    const data = {
        userid: req.userInfo.userid
    }
    const response = await axios.post('http://localhost:4001/api/user/profile', data, option)
    res.render('user/profile.html', {
        user: response.data
    });
};

exports.profileEdit = async (req, res) => {
    const option = {
        'Content-type': 'application/json',
        withCredentials: true,
    }
    const data = {
        userid: req.userInfo.userid
    }
    const response = await axios.post('http://localhost:4001/api/user/profile', data, option)

    let result = {
        ...response.data
    }
    const mobileArr = result.mobile.split('-')
    const mobile1 = mobileArr[0]
    const mobile2 = mobileArr[1]
    const mobile3 = mobileArr[2]
    delete result.mobile
    result = {
        ...result,
        mobile1,
        mobile2,
        mobile3
    }

    let phoneArr, phone1, phone2, phone3
    if (result.phone) {
        phoneArr = response.data.phone.split('-')
        phone1 = phoneArr[0]
        phone2 = phoneArr[1]
        phone3 = phoneArr[2]
        result = {
            ...result,
            phone1,
            phone2,
            phone3
        }
    }


    res.render('user/profileUpdate.html', {
        user: result
    });
};

exports.nickchk = async (req, res) => {
    const { nickname } = req.body;

    const sql = `SELECT * FROM user WHERE nickname = "${nickname}"`
    let [result] = await promisePool.query(sql)

    if (nickname == '') {
        res.send({ er: 0 })
    } else if (result.length == 1) {
        res.send({ er: 1 })
    } else {
        res.send({ er: 2 })
    }
};


exports.myboard = (req, res) => {
    const { userid } = req.userInfo
    res.render('user/myboard.html', {
        userid
    });
};

exports.mycomment = (req, res) => {
    const { userid } = req.userInfo
    res.render('user/mycomment.html', {
        userid
    });
};

exports.myscrap = (req, res) => {
    const { userid } = req.userInfo
    res.render('user/myscrap.html', {
        userid
    });
};
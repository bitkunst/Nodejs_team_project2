const { decodePayload } = require('../../utils/jwt.js')
const client_id = '50b75fc17d47bf2ba9978434d0a940cf'
const redirect_uri = 'http://localhost:3001/oauth/kakao'
const client_secret = 'CFOkTpjElWk2vT1I4g4nb7xrCjhHyu3K'
const host = 'https://kauth.kakao.com'
const qs = require('qs')
const { default: axios } = require('axios')
const { alertmove } = require('../../utils/alertmove.js');



exports.login = (req, res) => {
    res.render('user/login.html');
};


exports.logout = (req, res) => {
    res.clearCookie('AccessToken');
    res.send(alertmove('http://localhost:3001', '로그아웃 되었습니다.'));
}

exports.kakaoLogin = (req, res) => {
    const redirectURI = host + `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    res.redirect(redirectURI)
};

exports.oauthkakao = async (req, res) => {
    const { query: { code } } = req
    const token_url = host + '/oauth/token'
    const headers = {
        'Content-type': 'application/x-www-form-urlencoded'
    }

    const body = qs.stringify({
        grant_type: 'authorization_code',
        client_id: '50b75fc17d47bf2ba9978434d0a940cf',
        redirect_uri: 'http://localhost:3001/oauth/kakao',
        code: code,
        client_secret,
    })



    // 2. 토큰받기

    const response = await axios.post(token_url, body, headers)
    response.data.access_token

    // 3. 토큰을 활용하여 사용자 정보 가져오기
    try {
        const { access_token: ACCESS_TOKEN } = response.data
        const url = 'https://kapi.kakao.com/v2/user/me'
        const userinfo = await axios.post(url, null, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
        console.log(userinfo.data.kakao_account.profile.profile_image_url)
        console.log(userinfo.data.kakao_account.profile.nickname)


    } catch (e) {
        console.log(e)
    }
    res.send('로그인성공')
}

exports.join = (req, res) => {
    res.render('user/join.html');
};

exports.welcome = async (req, res) => {
    res.render('user/welcome.html')
}

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
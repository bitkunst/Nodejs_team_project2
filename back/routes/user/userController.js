require('dotenv').config()
const { promisePool } = require('../../db')
const { alertmove } = require('../../utils/alertmove.js');
const { createToken } = require('../../utils/jwt.js')
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { userid, userpw } = req.body;
        const sql = `SELECT * FROM user WHERE userid = "${userid}" AND userpw = "${userpw}"`;
        let [result] = await promisePool.query(sql);
        if (result[0] !== undefined) {

            const { userid, nickname } = result[0]
            const payload = {
                userid,
                nickname
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost'
            })

            res.redirect('http://localhost:3001')
        } else {
            res.send(alertmove('http://localhost:3001/user/login', '존재하지 않는 계정입니다.'));

        }
    } catch (error) {
        console.log(error);
    }
};

exports.join = async (req, res) => {
    const { userid, userpw, name, nickname, address, gender, mobile1, mobile2, mobile3, phone1, phone2, phone3, email, bio } = req.body
    try {
        const sql = `INSERT INTO user
                  (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point)
                  values
                  ("${userid}", "${userpw}", "${name}", "${nickname}", "${address}","${gender}","${mobile1}-${mobile2}-${mobile3}",
                  "${phone1}-${phone2}-${phone3}","${email}","${bio}",0)`;
        const sql2 = `INSERT INTO user
                  (userid, userpw, name, nickname, address, gender, mobile, email, bio, point)
                  values
                  ("${userid}", "${userpw}", "${name}", "${nickname}", "${address}","${gender}","${mobile1}-${mobile2}-${mobile3}",
                  "${email}","${bio}",0)`;
        if (phone1 == '' || phone2 == '' || phone3 == '') {
            const [result] = await promisePool.execute(sql2);
        } else {
            await promisePool.query(sql);
        }
        res.send(
            alertmove(
                'http://localhost:3001/user/welcome',
                '회원가입이 완료되었습니다.'
            )
        );
    } catch (error) {
        res.send(alertmove('http://localhost:3001/user/join', '사용중인 아이디 혹은 닉네임입니다.'))
    }
};

exports.idchk = async (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT * FROM user WHERE userid = "${userid}"`
    let [result] = await promisePool.query(sql)

    if (userid == '') {
        res.send({ err: 0 })
    } else if (result.length == 1) {
        res.send({ err: 1 })
    } else {
        res.send({ err: 2 })
    }

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

exports.profile = async (req, res) => {
    const { userid } = req.body
    const sql = `SELECT * FROM user WHERE userid=?`
    const prepare = [userid]
    let [[result]] = await promisePool.execute(sql, prepare)

    res.json(result) // result값을 브라우저 profile로
}

exports.profileUpdate = async (req, res) => {
    try {
        let { userpw, nickname, address, mobile1, mobile2, mobile3, phone1, phone2, phone3, email, bio, userid } = req.body
        let phone = phone1 + '-' + phone2 + '-' + phone3
        const mobile = mobile1 + '-' + mobile2 + '-' + mobile3
        if (phone == '--') {
            phone = null
        }
        const sql = `UPDATE user SET userpw=?, nickname=?, address=?, mobile=?, phone=?, email=?, bio=? WHERE userid=?`
        const prepare = [userpw, nickname, address, mobile, phone, email, bio, userid]
        const [result] = await promisePool.execute(sql, prepare)

        res.send(alertmove('http://localhost:3001/user/profile', '수정이 완료되었습니다.'))
    } catch (err) {
        if (err.errno == 1062) {
            res.send(alertmove('http://localhost:3001/user/profile/update', '사용 중인 닉네임입니다.'))
        }
    }
}


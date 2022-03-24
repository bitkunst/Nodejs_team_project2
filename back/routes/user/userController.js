require('dotenv').config()
const { promisePool } = require('../../db')
const { alertmove } = require('../../utils/alertmove.js');
const jwt = require('jsonwebtoken')


// 회원정보 확인 후 DB에 데이터가 있으면 로그인, 없으면 경고문구
exports.login = async (req, res) => {
    try {
        const { userid, userpw } = req.body;
        const sql = `SELECT * FROM user WHERE userid = "${userid}" AND userpw = "${userpw}"`;
        let [result] = await promisePool.query(sql);
        console.log(result)
        if (result[0] !== undefined) {

            // jwt토큰생성 // 생성 끝났어 그 다음 쿠키담아서보내고 리다이렉트 메인
            const { userid: uid, nickname } = result[0]
            console.log(userid, nickname)
            const option = {
                algorithm: "HS256",
            }
            const payload = {
                uid,
                nickname
            }
            const secretKey = process.env.SALT
            const jwt_token = jwt.sign(payload, secretKey, option)
            console.log(jwt_token)
            res.cookie('jwt', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true
            })
            res.redirect('http://localhost:3001')
        } else {
            res.send(alertmove('http://localhost:3001/user/login', '존재하지 않는 계정입니다.'));
            // 경고문구 로그인 후 이용
        }
    } catch (error) {
        console.log(error);
    }
};

exports.join = async (req, res) => {
    const { userid, userpw, name, nickname, address, gender, mobile1, mobile2, mobile3, phone1, phone2, phone3, email, bio, point } = req.body
    console.log(req.body)
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
            await promisePool.query(sql2);
        } else {
            await promisePool.query(sql);
        }
    } catch (error) {

    }
    res.send(
        alertmove(
            'http://localhost:3001/user/welcome',
            '회원가입이 완료되었습니다.'
        )
    );
};

// exports.join = async (req, res) => {
//     const { body } = req;
//     const conn = await promisePool.getConnection();
//     try {
//         const sql = `INSERT INTO user
//                   (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point)
//                   values
//                   ("${body.userid}", "${body.userpw}", "${body.name}", "${body.nickname}", "${body.address}","${body.gender}","${body.mobile1}-${body.mobile2}-${body.mobile3}",
//                   "${body.phone1}-${body.phone2}-${body.phone3}","${body.email}","${body.bio}","${body.point}")`;
//         const sql2 = `INSERT INTO user
//                   (userid, userpw, name, nickname, address, gender, mobile, email, bio, point)
//                   values
//                   ("${body.userid}", "${body.userpw}", "${body.name}", "${body.nickname}", "${body.address}","${body.gender}","${body.mobile1}-${body.mobile2}-${body.mobile3}",
//                   "${body.email}","${body.bio}","${body.point}")`;
//         if (body.phone1 == '' || body.phone2 == '' || body.phone3 == '') {
//             await conn.query(sql2);
//         } else {
//             await conn.query(sql);
//         }
//     } catch (error) {
//         console.log(error);
//     } finally {
//         conn.release();
//     }
//     res.send(
//         alertmove(
//             '회원가입이 완료되었습니다.'
//         )
//     );
// };
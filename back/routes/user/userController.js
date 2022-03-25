require('dotenv').config()
const { promisePool } = require('../../db')
const { alertmove } = require('../../utils/alertmove.js');
const { createToken } = require('../../utils/jwt.js')
const jwt = require('jsonwebtoken')
// const { createToken } = require('../../utils/jwt.js')

// 회원정보 확인 후 DB에 데이터가 있으면 로그인, 없으면 경고문구
exports.login = async (req, res) => {
    try {
        const { userid, userpw } = req.body;
        const sql = `SELECT * FROM user WHERE userid = "${userid}" AND userpw = "${userpw}"`;
        let [result] = await promisePool.query(sql);
        if (result[0] !== undefined) {

            // jwt토큰생성 // 생성 끝났어 그 다음 쿠키담아서보내고 리다이렉트 메인
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


// userid userpw  name nickname  adress gender mobile  phone  email   bio    point
// exports.join = async (req, res) => {
//     const { userid, userpw, name, nickname, adress, gender, mobile, phone } =
//         req.body;
//     const conn = await pool.getConnection();
//     const sql = `INSERT INTO user 
//                 (userid, userpw, name, nickname, adress, gender, mobile, phone, email, bio, point)
//                 VALUES
//                 (?,?,?,?,?,?,?,?,?,?,'0')`;
//     const prepare = [
//         userid,
//         userpw,
//         name,
//         nickname,
//         adress,
//         gender,
//         mobile,
//         phone,
//         email,
//         bio,
//         point
//     ];
//     let data = {
//         result: 'fail',
//         err: 'fail',
//     };
//     try {
//         const [result] = await conn.query(sql, prepare);
//         data = {
//             ...data,
//             result,
//         };
//         const cookieOpt = {
//             path: '/',
//             httpOnly: true,
//             secure: true,
//             domain: 'localhost',
//         };
//         res.cookie('name', 'kong', cookieOpt);
//     } catch (err) {
//         data = {
//             ...data,
//             err,
//         };
//         console.log(err);
//     } finally {
//         res.send(data);
//         conn.release();
//         res.redirect('/')
//     }
// };


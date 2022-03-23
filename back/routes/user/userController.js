const pool = require('../../db').pool

// 회원정보 확인 후 DB에 데이터가 있으면 로그인, 없으면 경고문구 구현
exports.login = async (req, res) => {
    const sql = ``
    let response = {
        errno: 1
    }
    const conn = await pool.getConnection()
    try {
        const [result] = await conn.execute(sql)
        response = {
            ...response,
            errno: 0,
            result: result,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
        res.json(response)
    } finally { conn.release() }
}


// exports.join = async (req, res) => {
//     req.body
//     const sql = ``
//     let response = {
//         errno: 1
//     }
//     const conn = await pool.getConnection()
//     try {
//         const [result] = await conn.execute(sql)
//         response = {
//             ...response,
//             errno: 0,
//             result: result,
//         }
//         res.json(response)
//     } catch (e) {
//         console.log(e)
//         res.json(response)
//     } finally { conn.release() }
// }
// userid userpw  name nickname  adress gender mobile  phone  email   bio    point
exports.join = async (req, res) => {
    const { userid, userpw, name, nickname, adress, gender, mobile, phone } =
        req.body;
    const conn = await pool.getConnection();
    const sql = `INSERT INTO user 
                (userid, userpw, name, nickname, adress, gender, mobile, phone, email, bio, point)
                VALUES
                (?,?,?,?,?,?,?,?,?,?,'0')`;
    const prepare = [
        userid,
        userpw,
        name,
        nickname,
        adress,
        gender,
        mobile,
        phone,
        email,
        bio,
        point
    ];
    let data = {
        result: 'fail',
        err: 'fail',
    };
    try {
        const [result] = await conn.query(sql, prepare);
        data = {
            ...data,
            result,
        };
        const cookieOpt = {
            path: '/',
            httpOnly: true,
            secure: true,
            domain: 'localhost',
        };
        res.cookie('name', 'kong', cookieOpt);
    } catch (err) {
        data = {
            ...data,
            err,
        };
        console.log(err);
    } finally {
        res.send(data);
        conn.release();
        res.redirect('/')
    }
};

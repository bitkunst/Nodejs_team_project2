require('dotenv').config()
const { promisePool } = require('../../db')
const { alertmove } = require('../../utils/alertmove.js');
const { createToken } = require('../../utils/jwt.js')

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
                domain: 'localhost',
                maxAge: 60*60*1000
            })

            res.redirect('http://localhost:3001')
        } else {
            res.send(alertmove('http://localhost:3001/user/login', '존재하지 않는 계정입니다.'));

        }
    } catch (error) {
        console.log(error);
    }
};

exports.kakaoLogin = async (req, res) => {
    const properties = req.user._json.properties
    const account = req.user._json.kakao_account
    if (account.gender == 'male') { 
        account.gender = 'M'
    } else {
        account.gender = 'F'
    }
    const userInfo = {
        nickname: properties.nickname,
        profileImg: properties.profile_image,
        email: account.email,
        gender: account.gender
    }
    try {
        const sql = 'SELECT userid FROM user WHERE userid=?'
        const prepare = [userInfo.email]
        const [rows1,] = await promisePool.query(sql, prepare)
        if (rows1[0] != undefined) {
            const payload = {
                userid: userInfo.email,
                nickname: userInfo.nickname
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        } else {
            const sql2 = 'INSERT INTO user (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point, uImg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
            const prepare2 = [userInfo.email, '0000', userInfo.nickname, userInfo.nickname, '대한민국', userInfo.gender, '010-0000-0000', '전화번호 없음', userInfo.email, '안녕하세요', 0, userInfo.profileImg]
            await promisePool.query(sql2, prepare2)

            const payload = {
                userid: userInfo.email,
                nickname: userInfo.nickname
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        }
    } catch(err) {
        console.log(err)
    }
};

exports.googleLogin = async (req, res) => {
    const {name, picture, email} = req.user._json
    const userInfo = {
        name,
        email,
        profileImg: picture
    }
    try {
        const sql = 'SELECT userid FROM user WHERE userid=?'
        const prepare = [userInfo.email]
        const [rows1,] = await promisePool.query(sql, prepare)
        if (rows1[0] != undefined) {
            const payload = {
                userid: userInfo.email,
                nickname: userInfo.name
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        } else {
            const sql2 = 'INSERT INTO user (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point, uImg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
            const prepare2 = [userInfo.email, '0000', userInfo.name, userInfo.name, '대한민국', 'N', '010-0000-0000', '전화번호 없음', userInfo.email, '안녕하세요', 0, userInfo.profileImg]
            await promisePool.query(sql2, prepare2)

            const payload = {
                userid: userInfo.email,
                nickname: userInfo.name
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        }
    } catch(err) {
        console.log(err)
    }
}

exports.naverLogin = async (req, res) => {
    const {nickname, email, profile_img} = req.user._json
    const userInfo = {
        nickname,
        email,
        profileImg: profile_img
    }
    try {
        const sql = 'SELECT userid FROM user WHERE userid=?'
        const prepare = [userInfo.email]
        const [rows1,] = await promisePool.query(sql, prepare)
        if (rows1[0] != undefined) {
            const payload = {
                userid: userInfo.email,
                nickname: userInfo.nickname
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        } else {
            const sql2 = 'INSERT INTO user (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point, uImg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
            const prepare2 = [userInfo.email, '0000', userInfo.nickname, userInfo.nickname, '대한민국', 'N', '010-0000-0000', '전화번호 없음', userInfo.email, '안녕하세요', 0, userInfo.profileImg]
            await promisePool.query(sql2, prepare2)

            const payload = {
                userid: userInfo.email,
                nickname: userInfo.name
            }
            const jwt_token = createToken(payload)
            res.cookie('AccessToken', jwt_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                maxAge: 60*60*1000
            })
            res.redirect('http://localhost:3001')
        }
    } catch(err) {
        console.log(err)
    }
}

exports.join = async (req, res) => {
    const { userid, userpw, name, nickname, address, gender, mobile1, mobile2, mobile3, phone1, phone2, phone3, email, bio } = req.body
    const uImg = 'http://localhost:4001/profile_img/' + req.uImg
    try {
        const sql = `INSERT INTO user
                  (userid, userpw, name, nickname, address, gender, mobile, phone, email, bio, point, uImg)
                  values
                  ("${userid}", "${userpw}", "${name}", "${nickname}", "${address}", "${gender}", "${mobile1}-${mobile2}-${mobile3}", 
                  "${phone1}-${phone2}-${phone3}", "${email}", "${bio}", 0, "${uImg}")`;
        const sql2 = `INSERT INTO user
                  (userid, userpw, name, nickname, address, gender, mobile, email, bio, point, uImg)
                  values
                  ("${userid}", "${userpw}", "${name}", "${nickname}", "${address}", "${gender}", "${mobile1}-${mobile2}-${mobile3}", 
                  "${email}", "${bio}", 0, "${uImg}")`;
        if (phone1 == '' || phone2 == '' || phone3 == '') {
            await promisePool.execute(sql2);
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
        console.log(error)
        res.send(alertmove('http://localhost:3001/user/join', '사용중인 아이디 혹은 닉네임입니다.'))
    }
};

exports.myboard = async (req, res) => {
    const userid = req.body.userid
    let response = {
        errno: 1
    }
    try {
        const sql0 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(lid) as likes, nickname, img, GROUP_CONCAT(hstg order by hstg asc SEPARATOR '-') as hashtag 
                from board 
                left join user on board.b_userid = user.userid 
                left join img on img.bid = board.idx and img.seq = 1
                left join likes on board.idx = likes.bid
                left join hashtag on board.idx = hashtag.bid
                where board.board_name = 'main' and active = 1 and b_userid = '${userid}'
                group by board.idx
                order by board.idx desc
                `
        await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);

        const [result] = await promisePool.execute(sql0);
        response = {
            ...response,
            errno: 0,
            result: result,
        }
        res.json(response)

    } catch (e) {
        console.log(e)
        res.json(response)

    }

};

exports.mycomment = async (req, res) => {
    const userid = req.body.userid
    let response = {
        errno: 1
    }
    try {
        const sql = `SELECT cid,
                            comment,
                            DATE_FORMAT(c_date, '%Y-%m-%d') AS date,
                            nickname,
                            idx
                    FROM comment
                    LEFT JOIN user ON
                    comment.c_userid = user.userid
                    LEFT JOIN board ON
                    comment.bid = board.idx
                    WHERE user.userid = '${userid}'
                    ORDER BY cid DESC
        `
        const sql2 = `SELECT count(cid) AS total_record 
                      FROM comment
                      WHERE c_userid = '${userid}' 
                      `

        const [result] = await promisePool.execute(sql);
        const [[{ total_record }]] = await promisePool.execute(sql2)

        response = {
            ...response,
            errno: 0,
            total_record,
            result: result,
        }
        res.json(response)

    } catch (e) {
        console.log(e)
        res.json(response)
    }
}

exports.myscrap = async (req, res) => {
    const userid = req.body.userid
    let response = {
        errno: 1
    }
    try {
        const sql0 = `SELECT board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(lid) as likes, nickname, img, GROUP_CONCAT(hstg order by hstg asc SEPARATOR '-') as hashtag 
        FROM board 
        LEFT JOIN user ON board.b_userid = user.userid 
        LEFT JOIN img ON img.bid = board.idx and img.seq = 1
        LEFT JOIN likes ON board.idx = likes.bid
        LEFT JOIN hashtag ON board.idx = hashtag.bid
        LEFT JOIN scrap ON board.idx = scrap.bid
        WHERE board.board_name = 'main' and active = 1 and s_userid = '${userid}'
        GROUP BY board.idx
        ORDER BY board.idx desc`

        await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);


        const [result] = await promisePool.execute(sql0);
        console.log(result)
        response = {
            ...response,
            errno: 0,
            result: result,
        }
        res.json(response)

    } catch (e) {
        console.log(e)
        res.json(response)

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

    res.json(result)
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

exports.quit = async (req, res) => {
    const { userid } = req.body
    console.log(userid)
    const sql = `DELETE FROM user WHERE userid=?`
    const prepare = [userid]
    let [result] = await promisePool.execute(sql, prepare)
    res.clearCookie('AccessToken');

    res.json(result) // result값을 브라우저 profile로

}
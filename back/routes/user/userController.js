require('dotenv').config()
const { promisePool } = require('../../db')
const { alertmove } = require('../../utils/alertmove.js');
const { createToken } = require('../../utils/jwt.js')
const { decodePayload } = require('../../utils/jwt.js')
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
    }                                                     //갑자기 count?                    갑자기 nickname? img?                 이건뭐지?
    try { // 보드에서 idx,title data format as date, view, count(조회된 데이터 갯수) as likes, nickname, img(유저,보드 다없는데..), group_concat as hashtag를 board에서 가져와
        // join문을 써서 user                                                                                                                       오름차순
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

exports.quit = async (req, res) => {
    const { userid } = req.body
    console.log(userid)
    const sql = `DELETE FROM user WHERE userid=?`
    const prepare = [userid]
    let [result] = await promisePool.execute(sql, prepare)
    res.clearCookie('AccessToken');

    res.json(result) // result값을 브라우저 profile로

}
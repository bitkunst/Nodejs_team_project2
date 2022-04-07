const express = require('express');
const router = express.Router();
const { promisePool } = require('../../db')
const { decodePayload } = require('../../utils/jwt')

router.post('/latest', async (req, res) => {
    const sql0 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(DISTINCT lid) as likes, GROUP_CONCAT(DISTINCT l_userid order by l_userid asc SEPARATOR '-') as l_userid, nickname, img, GROUP_CONCAT(DISTINCT hstg order by hstg asc SEPARATOR '-') as hashtag 
                from board 
                left join user on board.b_userid = user.userid 
                left join img on img.bid = board.idx and img.seq = 1
                left outer join likes on board.idx = likes.bid
                left join hashtag on board.idx = hashtag.bid
                where board.board_name = 'main' and active = 1
                group by board.idx
                order by board.idx desc`
    let response = {
        errno: 1
    }
    try {
        await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);
        let [result] = await promisePool.execute(sql0)
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
})

router.post('/popular', async (req, res) => {
    const sql0 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(DISTINCT lid) as likes, GROUP_CONCAT(DISTINCT l_userid order by l_userid asc SEPARATOR '-') as l_userid, nickname, img, GROUP_CONCAT(DISTINCT hstg order by hstg asc SEPARATOR '-') as hashtag 
                from board 
                left join user on board.b_userid = user.userid 
                left join img on img.bid = board.idx and img.seq = 1
                left outer join likes on board.idx = likes.bid
                left join hashtag on board.idx = hashtag.bid
                where board.board_name = 'main' and active = 1
                group by board.idx
                order by likes desc`
    let response = {
        errno: 1
    }
    try {
        await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);
        let [result] = await promisePool.execute(sql0)
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
})

router.post('/rank', async (req, res) => {
    const sql1 = `select nickname, 
                        count(DISTINCT board.idx) as boardCount, 
                        count(DISTINCT comment.cid) as commentCount, 
                        point 
                    from user 
                    left join board on board.b_userid = user.userid 
                    left join comment on comment.c_userid = user.userid 
                    group by user.userid 
                    order by point desc
                    limit 0,5;`
    let response = {
        errno: 1
    }
    try {
        const [result] = await promisePool.execute(sql1)
        response = {
            ...response,
            errno: 0,
            result
        }
        res.json(response)
    } catch (e) {
        console.log(e)
        res.json(response)
    }
})


router.post('/like', async (req, res) => {
    let { idx, likeFlag } = req.body
    likeFlag = parseInt(likeFlag)
    const token = req.cookies.AccessToken
    let userInfo = {}
    let response = {
        errno: 1
    }
    if (token) {
        userInfo = decodePayload(token)

        const userid = userInfo.userid
        // likes db에 추가
        const sql1 = `INSERT INTO likes(bid, l_userid) values(${idx},'${userid}')`
        const sql2 = `DELETE FROM likes WHERE bid=${idx} and l_userid='${userid}'`

        try {
            if (likeFlag === 1) {
                await promisePool.execute(sql2)
            } else {
                await promisePool.execute(sql1)
            }
            response = {
                ...response,
                errno: 0
            }
            res.json(response)

        } catch (e) {
            console.log(e)
            response = {
                ...response,
                errMsg: 'db통신오류'
            }
            res.json(response)
        }
    } else {
        response = {
            ...response,
            errno: 2,
            errMsg: '로그인 되지 않은 사용자'
        }
        res.json(response)
    }
})

module.exports = router;
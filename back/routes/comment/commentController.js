const { promisePool } = require('../../db')
const { decodePayload } = require('../../utils/jwt')

// 댓글 모두 ajax
// 댓글 리스트 브라우저로 전달
const viewApi = async (req, res) => {
    const { bid } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    const currentUserid = userinfo.userid
    let response = {
        errno: 1
    }
    try {
        let sql1 = `SELECT cid, comment, DATE_FORMAT(c_date,'%Y-%m-%d') as c_date, bid, nickname, c_userid, parent from comment 
                    left join user on comment.c_userid = user.userid
                    where bid = ${bid} order by if(parent=0, cid, parent);`
        const [result] = await promisePool.execute(sql1)
        response = {
            ...response,
            errno: 0,
            result,
            currentUserid
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// 새 댓글 작성 시 db에 추가
const writeApi = async (req, res) => {
    const { bid, b_userid, comment } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    let response = {
        errno: 1
    }
    try {
        let sql1 = `
        INSERT INTO comment(bid, c_date, comment, c_userid, parent) 
        values(${bid},now(), '${comment}', '${userinfo.userid}', 0) ;`
        const [result] = await promisePool.execute(sql1)
        // 댓글 작성 시 게시글 작성자에게 +10 포인트
        let pointSql = `UPDATE user SET point=point+10 WHERE userid = '${b_userid}'`
        await promisePool.execute(pointSql)
        response = {
            ...response,
            errno: 0,
            result
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// update로 수정한 내용 db에 저장
const updateApi = async (req, res) => {
    const { cid, cngCom } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    let response = {
        errno: 1
    }
    try {
        let sql1 = `UPDATE comment SET comment='${cngCom}' where cid=${cid};`
        const [result] = await promisePool.execute(sql1)
        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// delete시 삭제권한 확인 후 db에서 해당 내용 삭제
const deleteApi = async (req, res) => {
    const { cid } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    let response = {
        errno: 1
    }
    try {
        let sql1 = `DELETE FROM comment where cid = ${cid} or parent = ${cid};`
        const [result] = await promisePool.execute(sql1)
        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// 댓글 좋아요 기능은 시간 되면 넣기..
// 이미 좋아요 누른 사용자인지 확인 후 아니라면 like 테이블에 추가하고 board 테이블의 like 필드의 레코드 값 +1
const replyApi = async (req, res) => {
    const { bid, cid, c_userid, replyContent } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    let response = {
        errno: 1
    }
    try {
        let sql1 = `INSERT INTO comment(comment, c_date, bid, c_userid, parent) 
                    VALUES('${replyContent}', now(), ${bid}, '${userinfo.userid}', ${cid});`
        const [result] = await promisePool.execute(sql1)

        // 대댓글 작성 시 원댓글 작성자에게 +10 포인트
        let pointSql = `UPDATE user SET point=point+10 WHERE userid = '${c_userid}'`
        await promisePool.execute(pointSql)

        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}




module.exports = {
    viewApi,
    writeApi,
    updateApi,
    deleteApi,
    replyApi,
}
const { promisePool } = require('../../../db')
const { decodePayload } = require('../../../utils/jwt')


// 브라우저에서 ajax로 요청하면 db에서 게시글 목록 전달
const listApi = async (req, res) => {
    const sql = `select idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, likes, nickname , parent
                from board 
                left join user on board.b_userid = user.userid 
                where board_name = 'qna'
                order by if(ISNULL(parent), idx, parent) desc`
    let response = {
        errno: 1
    }
    try {
        const [result] = await promisePool.execute(sql)
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
}

// 프론트서버에서 ajax 요청시 db에서 해당 idx의 글 정보, 현재 접속한 유저 정보 전달
const viewApi = async (req, res) => {
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

// qna/answer 작성
const writeApi = async (req, res) => {
    const { title, content, parent, cg_idx, board_name } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)

    try {
        // 작성한 글 board db에 추가
        const [result0] = await promisePool.execute(`select count(idx) as seq from board where parent=${parent}`)
        const seq = result0[0].seq + 2
        let sql1 = `INSERT INTO board(title,content,date, view, likes, b_userid, parent, active, cg_idx, board_name, seq) 
                    values('${title}','${content}',now(), 0, 0, '${userinfo.userid}', ${parent}, 1, '${cg_idx}','${board_name}', ${seq} ) ;`
        const [result] = await promisePool.execute(sql1)

        // 글 작성시 포인트 +10
        let pointSql = `UPDATE user SET point=point+10 WHERE userid = '${userinfo.userid}'`
        await promisePool.execute(pointSql)


        res.redirect(`http://localhost:3001/board/qna/list`)
    } catch (e) {
        console.log(e)
    }

}

// update 페이지에서 수정한 내용 db에 저장
const updateApi = async (req, res) => {
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

// delete시 삭제권한 확인 후 db에서 해당 내용 삭제
const deleteApi = async (req, res) => {
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



module.exports = {
    listApi,
    viewApi,
    writeApi,
    updateApi,
    deleteApi,

}
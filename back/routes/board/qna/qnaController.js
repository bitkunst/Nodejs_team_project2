const { promisePool } = require('../../../db')


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

// write 페이지에서 입력한 내용 db에 저장 + 해시태그, 이미지 처리
const writeApi = async (req, res) => {
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
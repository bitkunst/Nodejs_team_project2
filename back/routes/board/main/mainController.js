const { promisePool } = require('../../../db')

// 브라우저에서 ajax로 요청하면 db에서 게시글 목록 전달
const listApi = async (req, res) => {
    const { cgArr } = req.body
    // 1. cgArr로 카테고리 인덱스 조회 : 쿼리문 하나로 통합해서 쓸 수도 있을 것 같은데 방법을 잘 모르겠음..
    // sql1 : 모든 카테고리 조회시. cgArr.length=0
    const sql0 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, likes, nickname 
                from board 
                left join user on board.b_userid = user.userid 
                where board.board_name = 'main' and active = 1
                order by board.idx desc`

    // sql2 : 메인 카테고리로 조회시. cgArr.length = 1
    const sql1 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, likes, nickname 
                from board 
                left join user on board.b_userid = user.userid 
                left join category as cg on board.cg_idx = cg.idx
                where board.board_name = 'main' and active = 1 and m_url = '${cgArr[0]}'
                order by board.idx desc`

    // sql3 : 서브카테고리로 조회시. cgArr.length = 2
    const sql2 = `select board.idx, title, DATE_FORMAT(date,'%Y-%m-%d') as date, view, likes, nickname 
                from board 
                left join user on board.b_userid = user.userid 
                left join category as cg on board.cg_idx = cg.idx
                where board.board_name = 'main' and active = 1 and m_url = '${cgArr[0]}' and s_url = '${cgArr[1]}'
                order by board.idx desc`
    let response = {
        errno: 1
    }
    try {
        let result
        if (cgArr.length == 0) {
            [result] = await promisePool.execute(sql0)
        } else if (cgArr.length == 1) {
            [result] = await promisePool.execute(sql1)
        } else if (cgArr.length == 2) {
            [result] = await promisePool.execute(sql2)
        }
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
    const { board_name, cg_idx, title, parent, content } = req.body
    const files = []
    req.files.forEach(v => {
        files.push(v.filename)
    })
    //const { userid } = req.user // 나중에 로그인 기능 되면 cookie-parsing해서 유저정보 담아놓고 사용
    const userid = 'admin'
    // qna에서 parent 설정해주는 sql은 따로 작성
    let sql1 = `
        INSERT INTO board(title,content,date, view, likes, b_userid, parent, active, cg_idx, board_name) 
        values('${title}','${content}',now(), 0, 0, '${userid}', ${parent}, 1, '${cg_idx}','${board_name}') ;`
    // img db에 추가
    let sql2 = `INSERT INTO img(bid, img) values(${idx}, )`
    try {
        const [result] = await promisePool.execute(sql1)
        res.redirect(`http://localhost:3001/board/${board_name}/list`)
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

// 이미 좋아요 누른 사용자인지 확인 후 아니라면 like 테이블에 추가하고 board 테이블의 like 필드의 레코드 값 +1
const likeApi = async (req, res) => {
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

// 이미 스크랩한 사용자인지 확인 후 아니라면 스크랩 테이블에 추가
const scrapApi = async (req, res) => {
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
    likeApi,
    scrapApi
}
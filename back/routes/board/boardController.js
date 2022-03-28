const { promisePool } = require('../../db')

const writeCategory = async (req, res) => {
    const { currentBoard } = req.body
    const sql = `select * from category where board_name = '${currentBoard}'`
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

// multer 사용하는 미들웨어 넣어주기 ⭕️
// 파일 db에 파일명 저장 ⭕️
// 해시태그 db에 해시태그 저장 <- 프론트 만들어주기
// qna에서 a(답변, 답글) 지정 시 parent 값 넣어주기
const writePost = async (req, res) => {
    const { board_name, cg_idx, title, parent, content } = req.body
    const files = []
    req.files.forEach(v => {
        files.push(v.filename)
    })
    //const { userid } = req.user // 나중에 로그인 기능 되면 cookie-parsing해서 유저정보 담아놓고 사용
    const userid = 'admin'
    // qna에서 parent 설정해주는 sql은 따로 작성
    try {
        // 작성한 글 board db에 추가
        let sql1 = `
        INSERT INTO board(title,content,date, view, likes, b_userid, parent, active, cg_idx, board_name) 
        values('${title}','${content}',now(), 0, 0, '${userid}', ${parent}, 1, '${cg_idx}','${board_name}') ;`
        const [result] = await promisePool.execute(sql1)
        // 첨부된 이미지가 있으면 img db에 추가
        if (files.length !== 0) {
            let sql2 = 'INSERT INTO img(bid, img, seq) values'
            files.forEach((v, i) => sql2 += `(${result.insertId}, '${v}', ${i + 1}),`)
            sql2 = sql2.replace(/,$/, '');
            const [result2] = await promisePool.execute(sql2)
        }
        // 해시태그가 있으면 해시태그 db에 추가


        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

// ajax로 프론트서버로 데이터 뿌려줌
const getArticleApi = async (req, res) => {
    const { idx } = req.body
    const sql = `select idx, title, content, DATE_FORMAT(date,'%Y-%m-%d') as date, view, likes, cg_idx, nickname, board_name 
                from board 
                left join user on board.b_userid = user.userid 
                where idx = ${idx}`
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

const deleteApi = async (req, res) => {
    const { idx, board_name } = req.body
    console.log(idx, board_name)
    const sql = `DELETE from board WHERE idx=${idx};` // board db에서 레코드 삭제
    // img, hashtag, scrap, likes, comment에서 해당 idx와 연결된 레코드 모두 삭제 : 쿼리문 찾아보기 
    try {
        const [result] = await promisePool.execute(sql)
        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

const updateApi = async (req, res) => {
    const { idx, board_name, cg_idx, title, parent, upload, content } = req.body
    //const { userid } = req.user // 나중에 로그인 기능 되면 cookie-parsing해서 유저정보 담아놓고 사용
    const userid = 'admin'
    // qna에서 parent 설정해주는 sql은 따로 작성
    let sql = `
        UPDATE board SET title = '${title}',content='${content}', cg_idx='${cg_idx}', board_name='${board_name}' WHERE idx = ${idx};`
    try {
        const [result] = await promisePool.execute(sql)
        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    writeCategory,
    writePost,
    getArticleApi,
    deleteApi,
    updateApi
}
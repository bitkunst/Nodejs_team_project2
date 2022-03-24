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

// multer 사용하는 미들웨어 넣어주기
// 파일 db에 파일명 저장
// 해시태그 db에 해시태그 저장 <- 프론트 만들어주기
// qna에서 a(답변, 답글) 지정 시 parent 값 넣어주기
const writePost = async (req, res) => {
    const { board_name, cg_idx, title, parent, upload, content } = req.body
    //const { userid } = req.user // 나중에 로그인 기능 되면 cookie-parsing해서 유저정보 담아놓고 사용
    const userid = 'admin'
    // qna에서 parent 설정해주는 sql은 따로 작성
    let sql1 = `
        INSERT INTO board(title,content,date, view, likes, b_userid, parent, active, cg_idx, board_name) 
        values('${title}','${content}',now(), 0, 0, '${userid}', ${parent}, 1, '${cg_idx}','${board_name}') ;`
    try {
        const [result] = await promisePool.execute(sql1)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    writeCategory,
    writePost
}
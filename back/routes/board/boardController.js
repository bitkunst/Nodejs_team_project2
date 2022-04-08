const { promisePool } = require('../../db')
const { decodePayload } = require('../../utils/jwt')

const writeCategory = async (req, res) => {
    const { currentBoard } = req.body
    const token = req.cookies.AccessToken
    let userInfo = {}
    if (token) { userInfo = decodePayload(token) }
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
            userInfo
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
    const { board_name, cg_idx, title, parent, content, hstg } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    const files = []
    req.files.forEach(v => {
        files.push(v.filename)
    })
    // qna에서 parent 설정해주는 sql은 따로 작성
    try {
        // 작성한 글 board db에 추가
        let sql1 = `INSERT INTO board(title,content,date, view, likes, b_userid, parent, active, cg_idx, board_name, seq) 
                    values('${title}','${content}',now(), 0, 0, '${userinfo.userid}', ${parent}, 1, '${cg_idx}','${board_name}', 1) ;`
        const [result] = await promisePool.execute(sql1)

        // 글 작성시 포인트 +10
        let pointSql = `UPDATE user SET point=point+10 WHERE userid = '${userinfo.userid}'`
        await promisePool.execute(pointSql)

        // 첨부된 이미지가 있으면 img db에 추가
        if (files.length !== 0) {
            let sql2 = 'INSERT INTO img(bid, img, seq) values'
            files.forEach((v, i) => { sql2 += `(${result.insertId}, '${v}', ${i + 1}),` })
            sql2 = sql2.replace(/,$/, '');
            const [result2] = await promisePool.execute(sql2)
        }
        // 해시태그가 있으면 해시태그 db에 추가
        const hstgArr = JSON.parse(hstg)
        if (hstgArr[0] != undefined) {
            let hstgSql = `INSERT INTO hashtag(bid, hstg) values`
            hstgArr.forEach(v => {
                hstgSql += `(${result.insertId}, '${v}'),`
            })
            hstgSql = hstgSql.replace(/,$/, '');
            const [result3] = await promisePool.execute(hstgSql)
        }

        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

// ajax로 프론트서버로 데이터 뿌려줌
const getArticleApi = async (req, res) => {
    const { idx } = req.body
    const sql = `select board.idx, title, content, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(lid) as likes, cg_idx, board.b_userid, nickname, board_name, active, GROUP_CONCAT(DISTINCT img order by img asc SEPARATOR '&-&') as img, GROUP_CONCAT(DISTINCT hstg order by hstg asc SEPARATOR '-') as hashtag
    from board 
    left join user on board.b_userid = user.userid 
    left join likes on board.idx = likes.bid
    left join hashtag on board.idx = hashtag.bid
    left join img on board.idx = img.bid
    where board.idx = ${idx};`
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
    const sql = `delete from a,b,c,d,e,f 
                using board as a 
                left join scrap as b on a.idx=b.bid 
                left join likes as c on a.idx=c.bid 
                left join comment as d on a.idx=d.bid 
                left join hashtag as e on a.idx=e.bid 
                left join img as f on a.idx=f.bid 
                where a.idx = ${idx};`
    try {
        const [result] = await promisePool.execute(sql)
        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

const updateApi = async (req, res) => {
    const { idx, board_name, cg_idx, title, parent, content, hstg } = req.body
    const files = []
    req.files.forEach(v => {
        files.push(v.filename)
    })
    //const { userid } = req.user // 나중에 로그인 기능 되면 cookie-parsing해서 유저정보 담아놓고 사용
    const userid = 'admin'
    // qna에서 parent 설정해주는 sql은 따로 작성
    const delSql1 = `delete from img where bid = ${idx};`
    const delSql2 = `delete from hashtag where bid = ${idx};`
    const updSql = `
        UPDATE board SET title = '${title}',content='${content}', cg_idx='${cg_idx}', board_name='${board_name}' WHERE idx = ${idx};`
    try {
        await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);
        await promisePool.execute(delSql1)
        await promisePool.execute(delSql2)
        const [result] = await promisePool.execute(updSql)

        // 첨부된 이미지가 있으면 img db에 추가
        if (files.length !== 0) {
            let sql2 = 'INSERT INTO img(bid, img, seq) values'
            files.forEach((v, i) => { sql2 += `(${idx}, '${v}', ${i + 1}),` })
            sql2 = sql2.replace(/,$/, '');
            await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);
            const [result2] = await promisePool.execute(sql2)
        }
        // 해시태그가 있으면 해시태그 db에 추가

        const hstgArr = JSON.parse(hstg)
        if (hstgArr[0] != undefined) {
            let hstgSql = `INSERT INTO hashtag(bid, hstg) values`
            hstgArr.forEach(v => {
                hstgSql += `(${idx}, '${v}'),`
            })
            hstgSql = hstgSql.replace(/,$/, '');
            await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);
            const [result3] = await promisePool.execute(hstgSql)
            await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`);

        }

        res.redirect(`http://localhost:3001/board/${board_name}/list`)
    } catch (e) {
        console.log(e)
    }
}

const viewApi = async (req, res, next) => {
    const { idx } = req.body
    const sql1 = `UPDATE board SET view=view+1 WHERE idx=${idx}; `
    const sql2 = `select board.idx, title, content, DATE_FORMAT(date,'%Y-%m-%d') as date, view, count(DISTINCT lid) as likes, category.main, category.sub, board.b_userid, nickname, board.board_name, active, GROUP_CONCAT(DISTINCT img order by img asc SEPARATOR '&-&') as img, GROUP_CONCAT(DISTINCT hstg order by hstg asc SEPARATOR '-') as hashtag, ANY_VALUE(parent)
                from board 
                left join user on board.b_userid = user.userid 
                left join likes on board.idx = likes.bid
                left join hashtag on board.idx = hashtag.bid
                left join img on board.idx = img.bid
                left join category on board.cg_idx = category.idx
                where board.idx = ${idx};`
    let response = {
        errno: 1
    }
    try {
        const [result1] = await promisePool.execute(sql1)
        const [result] = await promisePool.execute(sql2)
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

module.exports = {
    writeCategory,
    writePost,
    getArticleApi,
    deleteApi,
    updateApi,
    viewApi
}
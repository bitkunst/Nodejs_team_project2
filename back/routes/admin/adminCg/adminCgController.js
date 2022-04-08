const { promisePool } = require('../../../db')
const { decodePayload } = require('../../../utils/jwt')


// 카테고리 리스트 전달
const viewApi = async (req, res) => {
    let response = {
        errno: 1
    }
    try {
        let sql1 = `SELECT idx, board_name, main, m_url, sub, s_url from category
                    where board_name = 'main';`
        const [result] = await promisePool.execute(sql1)
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

// 메인카테고리 추가
const writeApi = async (req, res) => {
    const { main, m_url } = req.body
    let response = {
        errno: 1
    }
    try {
        // 1. sub가 NULL인 게시판의 key 값을 가져오기
        // 2. 모든 레코드를 숫자로 변환, maximum 찾은 후 +1 해서 새로운 m_key 생성해 문자로 변환
        // 3. idx, board_name, main, m_url, m_key 인서트
        let sql1 = `SELECT m_key FROM category WHERE board_name='main' and ISNULL(s_key)`
        const [result1] = await promisePool.execute(sql1)
        const mKeyArr = []
        result1.forEach(v => {
            mKeyArr.push(parseInt(v.m_key))
        })
        const newKey = Math.max(...mKeyArr) + 1

        let sql2 = `INSERT INTO category(idx, board_name, main, m_url, m_key) 
                    values(${newKey},'main', '${main}', '${m_url}', ${newKey}) ;`
        const [result2] = await promisePool.execute(sql2)

        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// 카테고리 업데이트 (제일 마지막에)
// 1. 해당 idx의 항목에서 이름과 url 받아와서 업데이트
// 2. 메인/서브 구분해서 처리하는 로직 필요
const updateApi = async (req, res) => {
    const { idx, cngCom, cngCom2 } = req.body
    const token = req.cookies.AccessToken
    const userinfo = decodePayload(token)
    let response = {
        errno: 1
    }
    try {
        if (idx.length === 3) {
            let sql1 = `UPDATE category SET main='${cngCom}', m_url='${cngCom2}' where idx=${idx};`
            const [result] = await promisePool.execute(sql1)
        } else {
            let sql1 = `UPDATE category SET sub='${cngCom}', s_url='${cngCom2}' where idx=${idx};`
            const [result] = await promisePool.execute(sql1)
        }
        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// 카테고리 삭제
// 1. 서브카테고리 삭제 시 해당 카테고리 게시글을 메인카테고리로 전환
// 2. 메인카테고리 삭제 시 해당 카테고리 게시글 전체 삭제 (+댓글, 이미지, 해시태그, 좋아요, 스크랩 레코드 삭제)
const deleteApi = async (req, res) => {
    const { idx } = req.body
    let response = {
        errno: 1
    }
    try {
        if (idx.length === 3) {
            // 메인카테고리 삭제
            let sql1 = `DELETE FROM category where m_key = '${idx}';`
            let sql2 = `DELETE FROM a,b,c,d,e,f,g
                        USING board AS a 
                        LEFT JOIN scrap AS b ON a.idx=b.bid 
                        LEFT JOIN likes AS c ON a.idx=c.bid 
                        LEFT JOIN comment AS d ON a.idx=d.bid 
                        LEFT JOIN hashtag AS e ON a.idx=e.bid 
                        LEFT JOIN img AS f ON a.idx=f.bid 
                        LEFT JOIN category AS g ON a.cg_idx=g.idx
                        WHERE g.idx LIKE '%${idx}%'`
            await promisePool.execute(sql1)
            await promisePool.execute(sql2)
        } else {
            // 서브카테고리 삭제
            let newIdx = idx.slice(0, 3)
            let sql1 = `DELETE FROM category where idx = '${idx}';`
            let sql2 = `UPDATE board SET cg_idx='${newIdx}' where cg_idx='${idx}';`
            await promisePool.execute(sql1)
            await promisePool.execute(sql2)
        }

        response = {
            ...response,
            errno: 0,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
    }
}

// 서브카테고리 추가
const replyApi = async (req, res) => {
    const { main, sub, s_url } = req.body
    let response = {
        errno: 1
    }
    try {
        // 1. sub가 NULL인 게시판의 key 값을 가져오기
        // 2. 모든 레코드를 숫자로 변환, maximum 찾은 후 +1 해서 새로운 m_key 생성해 문자로 변환
        // 3. idx, board_name, main, m_url, m_key 인서트
        let sql1 = `SELECT s_key, m_url, m_key FROM category WHERE board_name='main' and main='${main}'`
        const [result1] = await promisePool.execute(sql1)
        const sKeyArr = []
        let m_url = ''
        let m_key = ''
        result1.forEach(v => {
            if (v.s_key == null) { v.s_key = 0 }
            sKeyArr.push(parseInt(v.s_key))
            m_url = v.m_url
            m_key = v.m_key
        })
        let newKey = '' + (Math.max(...sKeyArr) + 1)
        newKey = newKey.length >= 3 ? newKey : new Array(3 - newKey.length + 1).join('0') + newKey;

        let sql2 = `INSERT INTO category(idx, board_name, main, m_url, m_key, sub, s_url, s_key) 
                    values('${m_key}${newKey}','main', '${main}', '${m_url}', ${m_key}, '${sub}', '${s_url}', '${newKey}') ;`
        const [result2] = await promisePool.execute(sql2)

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
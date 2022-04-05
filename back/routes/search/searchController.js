const {promisePool} = require('../../db.js')

const postSearchData = async (req, res)=>{
    try {
        const data = `%${req.body.data}%`
        const sql = `SELECT b.idx,
                            title,
                            content,
                            nickname,
                            DATE_FORMAT(date, '%Y-%m-%d %H:%i') AS date,
                            b.board_name,
                            nickname,
                            email,
                            bio,
                            img,
                            i.seq AS img_seq,
                            main,
                            sub,
                            m_url
                     FROM board AS b
                     LEFT JOIN user AS u ON
                     b.b_userid = u.userid
                     LEFT JOIN img AS i ON
                     b.idx = i.bid
                     LEFT JOIN category AS c ON
                     b.cg_idx = c.idx
                     WHERE ( nickname LIKE ? OR title LIKE ? OR content LIKE ? ) AND ( i.seq=1 OR i.seq IS NULL )
                     ORDER BY idx DESC
                     `
        const prepare = [data, data, data]
        const [rows,] = await promisePool.query(sql, prepare)
        res.json(rows)
    } catch(err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    postSearchData
}
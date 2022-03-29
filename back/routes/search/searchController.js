const {promisePool} = require('../../db.js')

const postSearchData = async (req, res)=>{
    try {
        const data = `%${req.body.data}%`
        console.log(data)
        const sql = `SELECT idx,
                            title,
                            content,
                            nickname,
                            DATE_FORMAT(date, '%Y-%m-%d %H:%i') AS date,
                            board_name,
                            nickname,
                            email,
                            bio,
                            img,
                            seq AS img_seq
                     FROM board AS b
                     LEFT JOIN user AS u ON
                     b.b_userid = u.userid
                     LEFT JOIN img AS i ON
                     b.idx = i.bid
                     WHERE ( nickname LIKE ? OR title LIKE ? OR content LIKE ? ) AND ( i.seq=1 OR i.seq IS NULL )
                     ORDER BY idx DESC
                     `
        const prepare = [data, data, data]
        const [rows,] = await promisePool.query(sql, prepare)
        console.log(rows)
        res.json(rows)
    } catch(err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    postSearchData
}
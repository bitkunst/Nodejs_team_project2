const {promisePool} = require('../../db.js')

const postSearchData = async (req, res)=>{
    try {
        const data = `%${req.body.data}%`
        console.log(data)
        const sql = `SELECT * FROM board b
                     LEFT JOIN user u ON
                     b.b_userid = u.userid
                     WHERE nickname LIKE ? OR title LIKE ? OR content LIKE ?
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
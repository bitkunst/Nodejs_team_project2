const {promisePool} = require('../../db.js')

const getChatList = async (req, res) => {
    const sql = 'SELECT * FROM chatroom'
    const [rows,] = await promisePool.query(sql)
    const response = {
        rows
    }
    res.json(response)
}

module.exports = {
    getChatList
}
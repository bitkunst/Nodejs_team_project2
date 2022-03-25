const {promisePool} = require('../../db.js')

const getChatList = async (req, res) => {
    try {
        const sql = 'SELECT * FROM chatroom ORDER BY idx'
        const [rows,] = await promisePool.query(sql)
        const response = {
            rows
        }
        res.json(response)
    } catch (err) {
        console.log(err)
    }

}

const postChatList = async (req, res) => {
    const {room} = req.body
    try {
        const sql = 'INSERT INTO chatroom (room) VALUES (?)'
        const prepare = [room]
        await promisePool.query(sql, prepare)
        res.redirect('http://localhost:3001/chat/list')
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    getChatList,
    postChatList
}
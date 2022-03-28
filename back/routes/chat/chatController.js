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
    const {roomMaker, roomExploder} = req.body
    try {
        if (roomMaker) {
            const sql = 'INSERT INTO chatroom (room) VALUES (?)'
            const prepare = [roomMaker]
            await promisePool.query(sql, prepare)
            res.redirect('http://localhost:3001/chat/list')
        }
        if (roomExploder) {
            const sql = 'DELETE FROM chatroom WHERE room=?'
            const prepare = [roomExploder]
            await promisePool.query(sql, prepare)

            const sql2 = 'DELETE FROM chat WHERE room=?'
            await promisePool.query(sql2, prepare)
            res.redirect('http://localhost:3001/chat/list')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    getChatList,
    postChatList
}
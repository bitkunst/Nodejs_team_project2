const {promisePool} = require('../../db.js')

function countRoom(io, roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

const user = '익명'

module.exports = (io) => {
    io.on('connection', (ws)=>{
        console.log('server webSocket connected')

        ws.on('enterRoom', async (roomName, done)=>{
            const sql = 'SELECT * FROM chat WHERE room=?'
            const prepare = [roomName]
            const [rows,] = await promisePool.query(sql, prepare)
            ws.join(roomName)
            const count = countRoom(io, roomName)
            done(rows, count)

            ws.to(roomName).emit('welcome', user, count)
        })

        ws.on('newMsg', async (msg, room, done)=>{
            const sql = "INSERT INTO chat (room, content, userid) VALUES (?, ?, ?)"
            const prepare = [room, msg, 'bitkunst']
            await promisePool.query(sql, prepare)
            ws.to(room).emit('newMsg', `익명 : ${msg}`)
            done()
        })

        ws.on('disconnecting', ()=>{
            ws.rooms.forEach(room => ws.to(room).emit('bye', user, countRoom(io,room)-1))
        })

    })
} 
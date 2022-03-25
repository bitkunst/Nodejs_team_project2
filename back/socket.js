const {promisePool} = require('./db.js')

function countRoom(io, roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

const userInfo = {} 

module.exports = (io) => {
    io.on('connection', (ws)=>{
        console.log('server webSocket connected')

        ws.on('enterRoom', async (roomName, nickname, done)=>{
            const socketId = ws.id
            userInfo[socketId] = nickname
            try {
                const sql = `SELECT content, 
                                    userid, 
                                    DATE_FORMAT(date, "%Y-%m-%d %H : %i") AS date 
                             FROM chat 
                             WHERE room=?
                             ORDER BY idx ASC`
                const prepare = [roomName]
                const [rows,] = await promisePool.query(sql, prepare)

                ws.join(roomName)
                const count = countRoom(io, roomName)
                done(rows, nickname, count)
    
                ws.to(roomName).emit('welcome', nickname, count)
            } catch(err) {
                console.log(err)
            }
        })

        ws.on('newMsg', async (msg, room, nickname, done)=>{
            try {
                const sql = "INSERT INTO chat (room, content, userid) VALUES (?, ?, ?)"
                const prepare = [room, msg, nickname]
                const [rows,] = await promisePool.query(sql, prepare)
                const {insertId} = rows
                const sql2 = `SELECT DATE_FORMAT(date, "%Y-%m-%d %H : %i") AS date 
                              FROM chat 
                              WHERE idx=?`
                const prepare2 = [insertId]
                const [rows2,] = await promisePool.query(sql2, prepare2)
                const date = rows2[0].date
                ws.to(room).emit('newMsg', msg, nickname, date)
                done(msg, date)
            } catch(err) {
                console.log(err)
            }
        })

        ws.on('disconnecting', ()=>{
            const socketId = ws.id
            const nickname = userInfo[socketId]
            ws.rooms.forEach(room => ws.to(room).emit('bye', nickname, countRoom(io,room)-1))
            delete userInfo[socketId]
        })

    })
} 
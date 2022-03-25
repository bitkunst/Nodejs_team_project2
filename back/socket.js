const {promisePool} = require('../../db.js')

function countRoom(io, roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

const user = '익명'

module.exports = (io) => {
    io.on('connection', (ws)=>{
        console.log('server webSocket connected')

        ws.on('enterRoom', async (roomName, done)=>{
            try {
                const sql = `SELECT content, 
                                    userid, 
                                    DATE_FORMAT(date, "%Y-%m-%d %H : %i") AS date 
                            FROM chat 
                            WHERE room=? AND userid=?`
                const prepare = [roomName, 'bitkunst']
                const [myRows,] = await promisePool.query(sql, prepare)

                const sql2 = `SELECT content, 
                                     userid, 
                                     DATE_FORMAT(date, "%Y-%m-%d %H : %i") AS date 
                              FROM chat 
                              WHERE room=? AND userid NOT IN (?)`
                const prepare2 = [roomName, 'bitkunst']
                const [othersRows,] = await promisePool.query(sql2, prepare2)
                ws.join(roomName)
                const count = countRoom(io, roomName)
                done(myRows, othersRows, count)
    
                ws.to(roomName).emit('welcome', user, count)
            } catch(err) {
                console.log(err)
            }
        })

        ws.on('newMsg', async (msg, room, done)=>{
            try {
                const sql = "INSERT INTO chat (room, content, userid) VALUES (?, ?, ?)"
                const prepare = [room, msg, 'bitkunst']
                const [rows,] = await promisePool.query(sql, prepare)
                const {insertId} = rows
                const sql2 = `SELECT DATE_FORMAT(date, "%Y-%m-%d %H : %i") AS date 
                              FROM chat 
                              WHERE idx=?`
                const prepare2 = [insertId]
                const [rows2,] = await promisePool.query(sql2, prepare2)
                const date = rows2[0].date
                ws.to(room).emit('newMsg', msg, date)
                done(msg, date)
            } catch(err) {
                console.log(err)
            }
        })

        ws.on('disconnecting', ()=>{
            ws.rooms.forEach(room => ws.to(room).emit('bye', user, countRoom(io,room)-1))
        })

    })
} 
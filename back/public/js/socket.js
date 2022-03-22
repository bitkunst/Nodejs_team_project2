module.exports = (io) => {
    io.on('connection', (ws)=>{
        console.log('webSocket connected')

        ws.emit('new_msg', 'hihi')

    })
} 
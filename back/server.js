const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')
const socket = require('./socket.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./routes/index.js')
const app = express()

const server = http.createServer(app)
const io = SocketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        credentials: true
    }
})
socket(io)

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))


app.use(router)

server.listen(4001, () => {
    console.log('back server onload')
})
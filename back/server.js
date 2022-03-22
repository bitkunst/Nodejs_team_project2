const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')
const socket = require('./public/js/socket.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

const server = http.createServer(app)
const io = SocketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        credentials: true
    }
})
socket(io)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

app.get('/', (req, res)=>{
    // res.json({msg: 'hi'})
    res.json({msg: 'hi'})
})

// socket(io)

server.listen(4001, ()=>{
    console.log('back server onload')
})
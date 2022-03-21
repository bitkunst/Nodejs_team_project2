const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser)
app.use(cors({
    origin: true,
    credentials: true
}))



app.listen(4001, ()=>{
    console.log('back server onload')
})
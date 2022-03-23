const express = require('express')
const nunjucks = require('nunjucks')
const router = require('./routes/index.js')
const cookieParser = require('cookie-parser')
const app = express()

app.set('view engine', 'html')
nunjucks.configure('./views', {
    express: app,
    watch: true
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))


app.use(router)


app.listen(3001, () => {
    console.log('front server onload')
})
const express = require('express')
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')
const chatRouter = require('./chat')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html')
})

router.use('/board', boardRouter)

router.use('/chat', chatRouter)

module.exports = router
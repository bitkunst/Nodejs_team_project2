const express = require('express')
const userRouter = require('./user/userRouter.js')
const router = express.Router()
const boardRouter = require('./board')

router.get('/', (req, res) => {
    res.render('index.html')
})

router.use('/board', boardRouter)

module.exports = router
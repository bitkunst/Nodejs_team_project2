const express = require('express')
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')
const chatRouter = require('./chat')
const searchRouter = require('./search')
const router = express.Router()
const { auth } = require('../middleware/auth.js')

router.get('/', (req, res) => {
    res.render('index.html')
})

router.use('/user', userRouter)
router.use('/board', auth, boardRouter)
router.use('/chat', chatRouter)
router.use('/search', searchRouter)

module.exports = router


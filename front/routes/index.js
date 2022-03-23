const express = require('express')
const router = express.Router()
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')

router.get('/', (req, res) => {
    res.render('index.html')
})

router.use('/user', userRouter)
router.use('/board', boardRouter)

module.exports = router;

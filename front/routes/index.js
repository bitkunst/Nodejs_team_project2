const express = require('express')
const { loginAuth } = require('../middleware/loginAuth.js')
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')
const chatRouter = require('./chat')
const searchRouter = require('./search')
const adminRouter = require('./admin')
const router = express.Router()
const { auth } = require('../middleware/auth.js')


router.get('/', loginAuth, (req, res) => {
    const userInfo = req.userInfo
    res.render('index.html', {
        userInfo
    })
})

router.use('/user', userRouter)
router.use('/board', auth, boardRouter)
router.use('/chat', chatRouter)
router.use('/search', searchRouter)
router.use('/admin', adminRouter)

module.exports = router


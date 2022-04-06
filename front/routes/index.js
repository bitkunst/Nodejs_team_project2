const express = require('express')
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')
const chatRouter = require('./chat')
const searchRouter = require('./search')
const adminRouter = require('./admin')
const router = express.Router()
const { auth } = require('../middleware/auth.js')
const { loginAuth } = require('../middleware/loginAuth.js')
const { promisePool } = require('../../back/db.js')

const OFGB = async (req, res, next) => {
    promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`)
    next()
}

router.get('/', loginAuth, OFGB, (req, res) => {
    const userInfo = req.userInfo
    res.render('index.html', {
        userInfo
    })
})

router.use('/user', userRouter)
router.use('/board', boardRouter)
router.use('/chat', chatRouter)
router.use('/search', searchRouter)
router.use('/admin', adminRouter)

module.exports = router


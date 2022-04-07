const express = require('express');
const userRouter = require('./user/userRouter.js')
const chatRouter = require('./chat')
const boardRouter = require('./board')
const commentRouter = require('./comment')
const searchRouter = require('./search')
const adminRouter = require('./admin')
const homeRouter = require('./home')
const router = express.Router();
const { promisePool } = require('../db')

const OFGB = async (req, res, next) => {
    await promisePool.execute(`SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'`)
    next()
}

router.use('/api/user', userRouter);
router.use('/api/chat', chatRouter)
router.use('/api/board', boardRouter);
router.use('/api/comment', commentRouter);
router.use('/api/search', searchRouter)
router.use('/api/admin', adminRouter)
router.use('/api/home', OFGB, homeRouter)

module.exports = router;
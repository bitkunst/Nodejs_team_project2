const express = require('express');
const userRouter = require('./user/userRouter.js')
const chatRouter = require('./chat')
const boardRouter = require('./board')
const commentRouter = require('./comment')
const searchRouter = require('./search')
const router = express.Router();

router.use('/api/user', userRouter);
router.use('/api/chat', chatRouter)
router.use('/api/board', boardRouter);
router.use('/api/comment', commentRouter);
router.use('/api/search', searchRouter)


module.exports = router;
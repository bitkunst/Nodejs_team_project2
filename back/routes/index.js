const express = require('express');
const userRouter = require('./user/userRouter.js')
const chatRouter = require('./chat/index.js')
const boardRouter = require('./board')
const commentRouter = require('./comment')
const router = express.Router();

// router.use('/user', userRouter);

router.use('/api/chat', chatRouter)
router.use('/api/board', boardRouter);
router.use('/api/comment', commentRouter);


module.exports = router;
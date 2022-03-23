const express = require('express');
const userRouter = require('./user/userRouter.js')
const boardRouter = require('./board')
const commentRouter = require('./comment')

const router = express.Router();

router.use('/user', userRouter);
router.use('/api/board', boardRouter);
router.use('/api/comment', commentRouter);

router.get('/', (req, res) => {
    res.send('hello')
});

module.exports = router;
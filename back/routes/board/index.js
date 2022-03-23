const express = require('express');
const noticeRouter = require('./notice')
const qnaRouter = require('./qna')
const mainRouter = require('./main')

const router = express.Router();

router.use('/notice', noticeRouter);
router.use('/qna', qnaRouter);
router.use('/main', mainRouter);

module.exports = router;
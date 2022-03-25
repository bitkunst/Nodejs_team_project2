const express = require('express');
const noticeRouter = require('./notice')
const qnaRouter = require('./qna')
const mainRouter = require('./main')
const boardCon = require('./boardController')

const router = express.Router();

router.use('/notice', noticeRouter);
router.use('/qna', qnaRouter);
router.use('/main', mainRouter);

router.post('/writeCategory', boardCon.writeCategory)
router.post('/write', boardCon.writePost)
router.post('/view', boardCon.getArticleApi)
router.post('/delete', boardCon.deleteApi)

module.exports = router;
const express = require('express')
const router = express.Router()
const noticeRouter = require('./notice')
const qnaRouter = require('./qna')
const mainBoardRouter = require('./mainBoard')


router.use('/notice', noticeRouter)
router.use('/qna', qnaRouter)
router.use('/main', mainBoardRouter)

module.exports = router
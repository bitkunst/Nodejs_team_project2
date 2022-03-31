const express = require('express');
const noticeRouter = require('./notice')
const qnaRouter = require('./qna')
const mainRouter = require('./main')
const boardCon = require('./boardController')
const upload = require('../../utils/multer')

const router = express.Router();

router.use('/notice', noticeRouter);
router.use('/qna', qnaRouter);
router.use('/main', mainRouter);

router.post('/writeCategory', boardCon.writeCategory)
router.post('/write', upload.array('upload'), boardCon.writePost)
router.post('/getArticle', boardCon.getArticleApi)
router.post('/view', boardCon.viewApi)
router.post('/delete', boardCon.deleteApi)
router.post('/update', upload.array('upload'), boardCon.updateApi)

module.exports = router;
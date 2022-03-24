const express = require('express');
const noticeRouter = require('./notice')
const qnaRouter = require('./qna')
const mainRouter = require('./main')
const { promisePool } = require('../../db')

const router = express.Router();

router.use('/notice', noticeRouter);
router.use('/qna', qnaRouter);
router.use('/main', mainRouter);

router.post('/writeCategory', async (req, res) => {
    const { currentBoard } = req.body
    const sql = `select * from category where board_name = '${currentBoard}'`
    let response = {
        errno: 1
    }
    try {
        const [result] = await promisePool.execute(sql)
        response = {
            ...response,
            errno: 0,
            result: result,
        }
        res.json(response)
    } catch (e) {
        console.log(e)
        res.json(response)
    }
})

module.exports = router;
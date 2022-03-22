const express = require('express')
const router = express.Router()

router.get('/list', (req, res) => {
    res.render('board/qna/list')
})

router.get('/view/:idx', (req, res) => {
    res.render('board/qna/view')
})

router.get('/write', (req, res) => {
    res.render('board/write')
})

router.get('/update', (req, res) => {
    res.render('board/qna/update')
})

module.exports = router
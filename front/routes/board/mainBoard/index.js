const express = require('express')
const router = express.Router()

router.get('/list', (req, res) => {
    res.render('board/main/list')
})

router.get('/view/:idx', (req, res) => {
    res.render('board/main/view')
})

router.get('/write', (req, res) => {
    res.render('board/write')
})

router.get('/update', (req, res) => {
    res.render('board/main/update')
})

module.exports = router
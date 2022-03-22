const express = require('express')
const router = express.Router()

// 브라우저에서 ajax로 리스트 받아옴.
router.get('/list', (req, res) => {
    res.render('board/notice/list')
})

// nunjucks로 {item} 넣어주기, back서버와 통신 필요
router.get('/view/:idx', (req, res) => {
    res.render('board/notice/view')
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기
router.get('/write', (req, res) => {
    res.render('board/write')
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기, nunjucks로 {item} 넣어주기, back서버와 통신 필요
router.get('/update', (req, res) => {
    res.render('board/notice/update')
})

module.exports = router
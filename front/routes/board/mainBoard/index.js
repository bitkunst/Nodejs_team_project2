const express = require('express')
const router = express.Router()
const axios = require('axios')

// 브라우저에서 ajax로 리스트 받아옴.
router.get('/list', (req, res) => {
    res.render('board/main/list')
})

// nunjucks로 {item} 넣어주기, back서버와 통신 필요
router.get('/view/:idx', async (req, res) => {
    try {
        const idx = req.params.idx
        const router = 'http://localhost:4001/api/board/getArticle'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = { idx }
        // 조회수 +1 해주기
        const response = await axios.post(router, data, option)
        const item = response.data.result[0]
        res.render('board/main/view', { item })
    } catch (error) {
        console.log(error)
        res.send('axios 오류')
    }
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기
router.get('/write', (req, res) => {
    res.render('board/write')
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기, nunjucks로 {item} 넣어주기, back서버와 통신 필요
router.get('/update/:idx', async (req, res) => {
    try {
        const idx = req.params.idx
        const router = 'http://localhost:4001/api/board/getArticle'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = { idx }
        const response = await axios.post(router, data, option)
        const item = response.data.result[0]
        res.render('board/update', { item })
    } catch (error) {
        console.log(error)
        res.send('axios 오류')
    }
})

module.exports = router
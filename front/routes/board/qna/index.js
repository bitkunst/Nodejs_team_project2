const express = require('express')
const router = express.Router()
const axios = require('axios')
const { auth } = require('../../../middleware/auth.js')

// 브라우저에서 ajax로 리스트 받아옴.
router.get('/list', (req, res) => {
    res.render('board/qna/list')
})

// nunjucks로 {{qItem, aList}} 보내기, 백서버와 통신 필요
router.get('/view/:idx', auth, async (req, res) => {
    try {
        const idx = req.params.idx
        const router = 'http://localhost:4001/api/board/view'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = { idx }
        const response = await axios.post(router, data, option)
        const item = response.data.result[0]

        // 글 작성자 본인 확인
        let userCheck = 0
        if (req.userInfo.nickname === item.nickname) { userCheck = 1 }

        // 질문/답변 확인
        let isAnswer = 1
        if (item.parent != undefined) {
            isAnswer = 0
        }
        res.render('board/qna/view', { item, userCheck, isAnswer })
    } catch (error) {
        console.log(error)
        res.send('axios 오류')
    }
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기
router.get('/writeA', auth, (req, res) => {
    const idx = req.query.q
    let adminFlag = 0
    if (req.userInfo.userid === 'admin') { adminFlag = 1 }
    res.render('board/qna/writeA', { adminFlag, idx })
})

router.get('/write', auth, (req, res) => {
    let adminFlag = 0
    if (req.userInfo.userid === 'admin') { adminFlag = 1 }
    res.render('board/write', { adminFlag })
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기, nunjucks로 {item} 넣어주기, back서버와 통신 필요
router.get('/update/:idx', auth, async (req, res) => {
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
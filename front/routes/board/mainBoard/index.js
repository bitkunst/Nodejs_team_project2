const express = require('express')
const router = express.Router()
const axios = require('axios')
const { auth } = require('../../../middleware/auth.js')

// 브라우저에서 ajax로 리스트 받아옴.

router.get('/list', auth, (req, res) => {
    res.render('board/main/list')
})

router.get('/list/:cg', (req, res) => {
    res.render('board/main/list')
})

router.get('/list/:cg1/:cg2', (req, res) => {
    res.render('board/main/list')
})

// nunjucks로 {item} 넣어주기, back서버와 통신 필요
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
        console.log(item)
        if (item.active != 1) { res.render('board/canNotAccess') }
        else {
            // 글 작성자 본인 확인
            let userCheck = 0
            const user = req.userInfo
            if (user.userid == item.b_userid) { userCheck = 1 }

            // 해시태그 분해
            htList = []
            if (item.hashtag != undefined) {
                htList = item.hashtag.split('-')
            }

            // 이미지 분해
            imgList = []
            if (item.img != undefined) {
                imgList = item.img.split('&-&')
            }
            console.log(imgList)
            res.render('board/main/view', { item, htList, imgList, userCheck, user })
        }
    } catch (error) {
        console.log(error)
        res.send('axios 오류')
    }
})

// ajax로 게시판/카테고리 구성하기 or  그냥 html 분리하기
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
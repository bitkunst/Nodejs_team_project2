const express = require('express')
const adminController = require('./adminController.js')
const router = express.Router()
const adminCgRouter = require('./adminCg')

router.get('/manage/user', adminController.getManageUser)

router.get('/manage/user/info', adminController.getUserInfo)

router.post('/manage/user/point', adminController.postUserPoint)

router.use('/manage/category', adminCgRouter)

router.get('/manage/board', adminController.getManageBoard)

router.post('/manage/board', adminController.postManageBoard)

module.exports = router
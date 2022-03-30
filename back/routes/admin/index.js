const express = require('express')
const adminController = require('./adminController.js')
const router = express.Router()

router.get('/manage/user', adminController.getManageUser)

router.get('/manage/user/info', adminController.getUserInfo)

router.post('/manage/user/point', adminController.postUserPoint)

router.get('/manage/category', adminController.getManageCg)

router.get('/manage/board', adminController.getManageBoard)

module.exports = router
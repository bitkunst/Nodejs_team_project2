const express = require('express')
const chatController = require('./chatController.js')
const { auth } = require('../../middleware/auth.js')
const router = express.Router()


router.use('/list', auth, chatController.getChatList)

router.use('/room', auth, chatController.getChatRoom)


module.exports = router

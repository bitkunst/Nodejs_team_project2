const express = require('express')
const chatController = require('./chatController.js')
const router = express.Router()


router.get('/list', chatController.getChatList)

router.post('/list', chatController.postChatList)

module.exports = router
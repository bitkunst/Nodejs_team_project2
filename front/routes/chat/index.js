const express = require('express')
const chatController = require('./chatController.js')
const router = express.Router()


router.use('/list', chatController.getChatList)

router.use('/room', chatController.getChatRoom)


module.exports = router

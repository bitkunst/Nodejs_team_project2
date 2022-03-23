const express = require('express')
const chatController = require('./chatController.js')
const router = express.Router()


router.get('/list', chatController.getChatList)


module.exports = router
const express = require('express')
const userRouter = require('./user/userRouter.js')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html')
})

module.exports = router
const express = require('express')
const adminController = require('./adminController.js')
const router = express.Router()

router.get('/', adminController.getAdminPage)

module.exports = router
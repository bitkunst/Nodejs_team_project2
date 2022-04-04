const express = require('express')
const adminController = require('./adminController.js')
const { auth } = require('../../middleware/auth.js')
const { adminCheck } = require('../../middleware/adminCheck.js')
const router = express.Router()

router.get('/', auth, adminCheck, adminController.getAdminPage)

module.exports = router
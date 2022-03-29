const express = require('express')
const searchController = require('./searchController.js')
const router = express.Router()

router.post('/', searchController.postSearchData)

module.exports = router
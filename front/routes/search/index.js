const express = require('express')
const searchController = require('./searchController.js')
const router = express.Router()

router.get('/', searchController.getSearchPage)


module.exports = router
const express = require('express');
const router = express.Router();
const userController = require('./userController.js');

router.post('api/login', userController.login);

router.post('api/join', userController.login);

module.exports = router;

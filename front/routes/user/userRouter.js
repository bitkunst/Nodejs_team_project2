const express = require('express');
const router = express.Router();
const userController = require('./userController');


router.get('/login', userController.login); // 로그인

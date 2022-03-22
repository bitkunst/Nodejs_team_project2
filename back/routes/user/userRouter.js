const express = require('express');
const router = express.Router();
const userController = require('./userController');


router.post('/login', userController.logincheck);

router.get('/logout', userController.logout);

router.get('/join', userController.join);

router.post('/join', userController.joincheck);

router.get('/profile', userController.profile);

router.post('/profile', userController.profilecheck);

router.get('/welcome', userController.welcome);

module.exports = router;

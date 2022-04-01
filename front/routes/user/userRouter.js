const express = require('express');
const router = express.Router();
const userController = require('./userController.js');
const { auth } = require('../../middleware/auth.js')


router.get('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/kakao/login', userController.kakaoLogin);

router.get('/oauth/kakao', userController.oauthkakao);

router.get('/join', userController.join);

router.get('/agree', userController.agree);

router.get('/welcome', userController.welcome);

router.get('/profile', auth, userController.profile);

router.get('/profile/update', auth, userController.profileEdit);


module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('./userController.js');
const { auth } = require('../../middleware/auth.js')


router.get('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/welcome', userController.welcome);

router.get('/profile/myboard', auth, userController.myboard);

router.get('/profile/mycomment', auth, userController.mycomment);

router.get('/profile/myscrap', auth, userController.myscrap);

router.get('/join', userController.join);

router.get('/agree', userController.agree);

router.get('/profile', auth, userController.profile);

router.get('/profile/update', auth, userController.profileEdit);


module.exports = router;

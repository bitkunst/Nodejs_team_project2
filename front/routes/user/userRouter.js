const express = require('express');
const router = express.Router();
const userController = require('./userController.js');
const { auth } = require('../../middleware/auth.js')


router.get('/login', userController.login);

router.get('/join', userController.join);

router.get('/agree', userController.agree);

router.get('/welcome', userController.welcome);

router.get('/profile', auth, userController.profile);

router.get('/profile/board', auth, userController.profileBoard)

router.get('/profile/update', userController.profileEdit);



module.exports = router;

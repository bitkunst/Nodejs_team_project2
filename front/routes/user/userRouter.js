const express = require('express');
const router = express.Router();
const userController = require('./userController.js');



router.get('/login', userController.login);

router.get('/join', userController.join);

router.get('/agree', userController.agree);

router.get('/welcome', userController.welcome);

router.get('/profile', userController.profile);

router.get('/profile/update', userController.profileEdit);



module.exports = router;

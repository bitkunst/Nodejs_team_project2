const express = require('express');
const router = express.Router();
const userController = require('./userController.js');

router.post('/login', userController.login);

router.post('/join', userController.join);


// router.get('/logout', userController.logout);

// router.get('/join', userController.join);

// router.get('/profile', userController.profile);

// router.post('/profile', userController.profilecheck);

// router.get('/welcome', userController.welcome);

module.exports = router;

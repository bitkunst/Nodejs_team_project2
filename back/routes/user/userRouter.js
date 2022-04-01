const express = require('express');
const router = express.Router();
const userController = require('./userController.js');

router.post('/login', userController.login);

router.post('/join', userController.join);

router.post('/profile', userController.profile);

router.post('/profile/update', userController.profileUpdate);

router.post('/idchk', userController.idchk);

router.post('/nickchk', userController.nickchk);


module.exports = router;

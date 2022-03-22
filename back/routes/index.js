const express = require('express');
const userRouter = require('./user/userRouter.js')

const router = express.Router();

router.use('/user', userRouter);


router.get('/', (req, res) => {
    res.send('hello')
});

module.exports = router;
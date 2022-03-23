const express = require('express');
const userRouter = require('./user/userRouter.js')
const chatRouter = require('./chat/index.js')

const router = express.Router();

// router.use('/user', userRouter);

router.use('/api/chat', chatRouter)


// router.get('/', (req, res) => {
//     res.send('hello')
// });

module.exports = router;
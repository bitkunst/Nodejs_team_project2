const axios = require('axios')

const getChatList = async (req, res) => {
    const { userid } = req.userInfo
    try {
        const response = await axios.get('http://localhost:4001/api/chat/list', {
            withCredentials: true
        })
        const result = response.data.rows
    
        res.render('./chat/chat.html',{
            result,
            userid
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

const getChatRoom = (req, res) => {
    const { nickname } = req.userInfo
    const roomName = req.query.name
    res.render('./chat/chatRoom.html', {
        roomName,
        nickname
    })
}


module.exports = {
    getChatList,
    getChatRoom
}
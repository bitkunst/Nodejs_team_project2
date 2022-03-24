const axios = require('axios')

const getChatList = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4001/api/chat/list', {
            withCredentials: true
        })
        const result = response.data.rows
    
        res.render('./chat/chat.html',{
            result
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
    }
}

const getChatRoom = (req, res) => {
    const roomName = req.query.name
    res.render('./chat/chatRoom.html', {
        roomName
    })
}


module.exports = {
    getChatList,
    getChatRoom
}
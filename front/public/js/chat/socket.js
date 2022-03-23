const socket = io.connect('http://localhost:4001', {
    withCredentials: true
})

socket.on('connect', ()=>{
    console.log('browser webSocket connected')
})

const roomName = location.href.split('?')[1].split('=')[1]
const chatbox = document.querySelector('#chatbox')
const roomCount = document.querySelector('#roomCount')

function addMessage(msg) {
    const ul = chatbox.querySelector('ul')
    const li = document.createElement('li')
    li.innerHTML = msg
    ul.append(li)
}

function handleMsgSubmit(e) {
    e.preventDefault()
    const msgInput = chatbox.querySelector('#msg > input')
    const value = msgInput.value
    socket.emit('newMsg', value, roomName, ()=>{
        addMessage(`YOU : ${value}`)
    })
    msgInput.value = ''
}

function roomChat(rows, count) {
    roomCount.innerHTML = `접속중 : ${count}`
    rows.forEach(v => addMessage(`${v.userid} : ${v.content}`))
    const msgForm = document.querySelector('#msg')
    msgForm.addEventListener('submit', handleMsgSubmit)
}


socket.emit('enterRoom', roomName, roomChat)

socket.on('newMsg', (msg)=>{
    addMessage(msg)
})

socket.on('welcome', (user, countRoom)=>{
    roomCount.innerHTML = `접속중 : ${countRoom}`
    addMessage(`${user} 님이 접속하셨습니다.`)
})

socket.on('bye', (user, countRoom)=>{
    roomCount.innerHTML = `접속중 : ${countRoom}`
    addMessage(`${user} 님이 퇴장하셨습니다.`)
})

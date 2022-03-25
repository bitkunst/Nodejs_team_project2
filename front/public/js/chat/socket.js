const socket = io.connect('http://localhost:4001', {
    withCredentials: true
})

socket.on('connect', ()=>{
    console.log('browser webSocket connected')
})

const roomName = location.href.split('?')[1].split('=')[1]
const roomCount = document.querySelector('#roomCount')
const msgForm = document.querySelector('#msgForm')
const innerElement = document.querySelector('#chatBox')
const nickname = document.querySelector('#nickname').value

function addMessage(msg, user, date) {
    const item_div = document.createElement('div')
    const box_div = document.createElement('div')
    const msg_p = document.createElement('p')
    const name_span = document.createElement('span')
    const time_span = document.createElement('span')
    msg_p.innerHTML = msg
    name_span.innerHTML = `By ${user}`
    time_span.innerHTML = date
    item_div.setAttribute('class', 'item')
    box_div.setAttribute('class', 'box')
    msg_p.setAttribute('class', 'msg')
    name_span.setAttribute('class', 'name')
    time_span.setAttribute('class', 'time')
    box_div.append(msg_p)
    box_div.append(name_span)
    box_div.append(time_span)
    item_div.append(box_div)
    innerElement.append(item_div)
    // innerElement.scrollTop = innerElement.scrollHeight
    window.scrollTo(0, document.body.scrollHeight)
    box_div.addEventListener('mouseover', ()=>{
        time_span.classList.add('timeOn')
    })
    box_div.addEventListener('mouseout', ()=>{
        time_span.classList.remove('timeOn')
    })
}

function addMyMessage(msg, date) {
    const item_div = document.createElement('div')
    const box_div = document.createElement('div')
    const msg_p = document.createElement('p')
    const name_span = document.createElement('span')
    const time_span = document.createElement('span')
    msg_p.innerHTML = msg
    name_span.innerHTML = `me`
    time_span.innerHTML = date
    item_div.setAttribute('class', 'item mymsg')
    box_div.setAttribute('class', 'box')
    msg_p.setAttribute('class', 'msg')
    name_span.setAttribute('class', 'name')
    time_span.setAttribute('class', 'time')
    box_div.append(msg_p)
    box_div.append(name_span)
    box_div.append(time_span)
    item_div.append(box_div)
    innerElement.append(item_div)
    // innerElement.scrollTop = innerElement.scrollHeight
    window.scrollTo(0, document.body.scrollHeight)
    box_div.addEventListener('mouseover', ()=>{
        time_span.classList.add('timeOn')
    })
    box_div.addEventListener('mouseout', ()=>{
        time_span.classList.remove('timeOn')
    })
}

function addNotice(msg) {
    const notice_div = document.createElement('div')
    notice_div.innerHTML = msg
    notice_div.setAttribute('class', 'notice')
    innerElement.append(notice_div)
    // innerElement.scrollTop = innerElement.scrollHeight
    window.scrollTo(0, document.body.scrollHeight)
}

function handleMsgSubmit(e) {
    e.preventDefault()
    const msgInput = msgForm.querySelector('input')
    const value = msgInput.value
    socket.emit('newMsg', value, roomName, nickname, (msg, date)=>{
        addMyMessage(msg, date)
    })
    msgInput.value = ''
}

function roomChat(rows, nickname, count) {
    roomCount.innerHTML = `접속중 : ${count}`
    // othersRows.forEach(v => addMessage(v.content, v.userid, v.date))
    // myRows.forEach(v => addMyMessage(v.content, v.date))
    rows.forEach(v => {
        if (v.nickname == nickname) {
            addMyMessage(v.content, v.date)
        } else {
            addMessage(v.content, v.nickname, v.date)
        }
    })
    msgForm.addEventListener('submit', handleMsgSubmit)
}


socket.emit('enterRoom', roomName, nickname, roomChat)

socket.on('newMsg', (msg, nickname, date)=>{
    addMessage(msg, nickname, date)
})

socket.on('welcome', (nickname, countRoom)=>{
    roomCount.innerHTML = `접속중 : ${countRoom}`
    addNotice(`${nickname} 님이 접속하셨습니다.`)
})

socket.on('bye', (nickname, countRoom)=>{
    roomCount.innerHTML = `접속중 : ${countRoom}`
    addNotice(`${nickname} 님이 퇴장하셨습니다.`)
})


const firstMsg = document.querySelector('#firstMsg')
const mention = document.createElement('h5')
mention.innerHTML = '더 이상 메세지가 없습니다.'

window.addEventListener('scroll', ()=>{
    if (window.scrollY == 0) {
        mention.classList.remove('alertOff')
        mention.classList.add('alert')
    } else {
        mention.setAttribute('class', 'alertOff')
        firstMsg.append(mention)
    }
})


const roomMaker = document.querySelector('#roomMaker')
const roomSubmit = document.querySelector('#roomSubmit')
roomMaker.addEventListener('click', ()=>{
    if (roomSubmit.classList.value == 'on') {
        roomSubmit.classList.remove('on')
    } else {
        roomSubmit.setAttribute('class', 'on')
    }
})
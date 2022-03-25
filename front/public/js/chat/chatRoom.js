
const roomMaker = document.querySelector('#roomMaker')
const roomMakerSubmit = document.querySelector('#roomMakerSubmit')
const roomExploderSubmit = document.querySelector('#roomExploderSubmit')

roomMaker.addEventListener('click', ()=>{
    if (roomMakerSubmit.classList.value == 'on') {
        roomMakerSubmit.classList.remove('on')
    } else {
        roomMakerSubmit.setAttribute('class', 'on')
    }
})

roomExploder.addEventListener('click', ()=>{
    if (roomExploderSubmit.classList.value == 'on') {
        roomExploderSubmit.classList.remove('on')
    } else {
        roomExploderSubmit.setAttribute('class', 'on')
    }
})
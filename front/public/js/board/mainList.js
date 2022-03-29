console.log('왜 안돼...ㅠㅠ')
const currentCg = document.location.href.split('?')[1]
const cgArr = []
if (currentCg !== undefined) {
    currentCg.split('&').forEach((v, i) => cgArr[i] = v.split('=')[1])
}

const getData = async (router) => {
    try {
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const dataObj = {
            cgArr
        }
        const response = await axios.post(router, dataObj, option)
        const errNo = response.data.errno
        const data = response.data.result
        if (errNo === 0) {
            return data
        } else {
            console.log('백엔드에서 에러발생')
            return
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }
}

const createList = (data, currentPage, viewArticle) => {
    const boardElement = document.querySelector('#boardList').innerHTML
    let str = ''

    data.slice((currentPage - 1) * viewArticle, currentPage * viewArticle).forEach((v, i) => {
        if (v.img == undefined) { v.img = 'js1648455420407.png' }
        str += boardElement
            .replace('{num}', data.length - (currentPage - 1) * viewArticle - i)
            .replace('{imageName}', v.img)
            .replace('{idx}', v.idx)
            .replace('{title}', v.title)
            .replace('{nickname}', v.nickname)
            .replace('{date}', v.date)
            .replace('{view}', v.view)
            .replace('{likes}', v.likes)
    })
    const boardUl = document.querySelector('#boardUl')
    boardUl.innerHTML = str

    // 여기에 해시태그 최대 3개 가져오는 코드 넣기 🔥
}

const createBtn = (data, currentBlock, viewArticle, blockArticle) => {
    const totalRecord = data.length
    //const viewArticle = 10 // 한 화면에 보일 게시물 수
    //const blockArticle = 10 // 한번에 보이는 페이지버튼 개수
    const totalPage = Math.ceil(totalRecord / viewArticle)
    const totalBlock = Math.ceil(totalPage / blockArticle)

    const pgElement = document.querySelector('#pageList').innerHTML
    const pageBtnDiv = document.querySelector('#pageBtnDiv')

    if (currentBlock > totalBlock) { currentBlock = totalBlock }
    if (currentBlock < 1) { currentBlock = 1 }

    let pageTemplate = ''
    for (let i = currentBlock * blockArticle - (blockArticle - 1); i <= currentBlock * blockArticle; i++) {
        if (i >= 1 && i <= totalPage) {
            pageTemplate += pgElement.replace('{pNum}', i)
        }
    }
    pageBtnDiv.innerHTML = pageTemplate

    const pageArr = document.querySelectorAll('.pNum')
    pageArr.forEach((v, i) => {
        v.addEventListener('click', () => { currentPage = v.innerHTML; createList(data, currentPage, viewArticle) })
    })
}

const changeBtn = (data, currentBlock, viewArticle, blockArticle) => {
    const totalRecord = data.length
    //const viewArticle = 10 // 한 화면에 보일 게시물 수
    //const blockArticle = 10 // 한번에 보이는 페이지버튼 개수
    const totalPage = Math.ceil(totalRecord / viewArticle)
    const totalBlock = Math.ceil(totalPage / blockArticle)

    const nextBtn = document.querySelector('#nextBtn')
    const prevBtn = document.querySelector('#prevBtn')

    nextBtn.addEventListener('click', () => {
        if (currentBlock < totalBlock) { currentBlock += 1 }
        createBtn(data, currentBlock, viewArticle, blockArticle)
    })

    prevBtn.addEventListener('click', () => {
        if (currentBlock > 1) { currentBlock -= 1 }
        createBtn(data, currentBlock, viewArticle, blockArticle)
    })
}

const showList = async (viewArticle, blockArticle) => {
    const router = 'http://localhost:4001/api/board/main/list'
    const data = await getData(router)
    // const totalRecord = data.length
    console.log(data)

    let currentBlock = 1
    let currentPage = 1

    changeBtn(data, currentBlock, viewArticle, blockArticle)
    createBtn(data, currentBlock, viewArticle, blockArticle)
    createList(data, currentPage, viewArticle)
}

showList(12, 10)


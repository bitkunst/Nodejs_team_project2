

// 0. 카테고리 식별
const currentCg = document.location.href.split('main/list')[1]
const cgArr = currentCg.split('/')
// if (currentCg !== undefined) {
//     currentCg.split('/').forEach((v, i) => cgArr[i] = v.split('=')[1])
// }
console.log(cgArr)

// 0.

// 1. 리스트 데이터 가져오기
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
        const userid = response.data.userid
        if (errNo === 0) {
            return { userid, data }
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

// 2. 데이터로 리스트 생성(🔥ajax로 좋아요 상태 받아오고 보여주는 함수를 여기에 넣을 거임.)
const createList = (data, userid, currentPage, viewArticle) => {
    const boardElement = document.querySelector('#boardList').innerHTML
    let str = ''
    data.slice((currentPage - 1) * viewArticle, currentPage * viewArticle).forEach((v, i) => {
        if (v.img == undefined) { v.img = 'js1648455420407.png' }
        const hstgArr = ['', '', '', '', '']
        if (v.hashtag != undefined) { v.hashtag.split('-').slice(0, 5).forEach((v, i) => hstgArr[i] = v) }

        let likeFlag = 0
        if (v.l_userid != undefined) {
            v.l_userid.split('-').forEach(id => {
                if (id == userid) { likeFlag = 1 }
            })
        }

        str += boardElement
            .replace('{num}', data.length - (currentPage - 1) * viewArticle - i)
            .replace('{imageName}', v.img)
            .replace(/{idx}/gi, v.idx)
            .replace('{title}', v.title)
            .replace('{nickname}', v.nickname)
            .replace('{date}', v.date)
            .replace('{view}', v.view)
            .replace('{likes}', v.likes)
            .replace('{hstg1}', hstgArr[0])
            .replace('{hstg2}', hstgArr[1])
            .replace('{hstg3}', hstgArr[2])
            .replace('{hstg4}', hstgArr[3])
            .replace('{hstg5}', hstgArr[4])
            .replace('{likeFlag}', likeFlag)
            .replace('{likeEmoji}', likeFlag == 1 ? '❤️' : '♡')

        likeFlag = 0
    })
    const boardUl = document.querySelector('#boardUl')
    boardUl.innerHTML = str
    likeHandeler(currentPage, viewArticle)
    //const likeFrm = document.querySelectorAll('.likeFrm')

}

// 3. 페이징 위한 버튼 생성
const createBtn = (data, userid, currentBlock, viewArticle, blockArticle) => {
    const totalRecord = data.length
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
        v.addEventListener('click', async () => {
            let currentPage = v.innerHTML;
            createList(data, userid, currentPage, viewArticle)
        })
    })
}

// 4. 페이지버튼 블록 바꾸기 (1~10/ 11~20 단위로)
const changeBtn = (data, userid, currentBlock, viewArticle, blockArticle) => {
    const totalRecord = data.length
    const totalPage = Math.ceil(totalRecord / viewArticle)
    const totalBlock = Math.ceil(totalPage / blockArticle)

    const nextBtn = document.querySelector('#nextBtn')
    const prevBtn = document.querySelector('#prevBtn')

    nextBtn.addEventListener('click', () => {
        if (currentBlock < totalBlock) { currentBlock += 1 }
        createBtn(data, userid, currentBlock, viewArticle, blockArticle)
    })

    prevBtn.addEventListener('click', () => {
        if (currentBlock > 1) { currentBlock -= 1 }
        createBtn(data, userid, currentBlock, viewArticle, blockArticle)
    })
}


// 위의 함수를 가져와서 원하는 페이지당 게시글 수(viewArticle), 버튼 블록의 버튼 수(blockArticle)를 지정 후 화면 렌더링
// 순서는 버튼 블록 -> 버튼 -> 리스트 순서로 연결되어 있음
const showList = async (viewArticle, blockArticle) => {
    const router = 'http://localhost:4001/api/board/main/list'
    const dataObj = await getData(router)
    const data = dataObj.data
    const userid = dataObj.userid

    console.log(data)

    let currentBlock = 1
    let currentPage = 1

    changeBtn(data, userid, currentBlock, viewArticle, blockArticle)
    createBtn(data, userid, currentBlock, viewArticle, blockArticle)
    createList(data, userid, currentPage, viewArticle)
}

showList(12, 10)


async function likeHandeler(currentPage, viewArticle) {
    const likeFrm = document.querySelectorAll('.likeFrm')
    likeFrm.forEach(v => {
        v.addEventListener('submit', async (e) => {
            e.preventDefault()
            const idx = parseInt(e.target.querySelector('.idx').value)
            const likeFlag = parseInt(e.target.querySelector('.likeFlag').value)
            try {
                const option = {
                    'Content-type': 'application/json',
                    withCredentials: true
                }
                const dataObj = {
                    idx, likeFlag
                }
                const response = await axios.post('http://localhost:4001/api/board/main/like', dataObj, option)
                const errNo = response.data.errno

                if (errNo === 0) {
                    showList(12, 10)
                } else {
                    console.log('백엔드에서 에러발생')
                    return
                }
            }
            catch (e) {
                console.log(`axios 통신 중 에러발생 : ${e.message}`)
                alert('문제가 발생했습니다')
            }
        })
    })

}
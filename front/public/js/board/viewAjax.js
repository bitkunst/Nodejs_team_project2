// 0. renderLike : like 여부에 따라 빈하트 / 꽉찬하트 다르게 랜더링
let likeFlag = document.querySelector('#likeFlag') // 1은 누른 상태, 0은 안누른 상태 : html에 추가해주기, 백엔드에서 이 값 가져오기
const likeFrm = document.querySelector('#likeFrm')
const likeBtn = document.querySelector('#likeBtn')
const idx = document.querySelector('#idx').value

const renderLike = async () => {
    try {
        const router = 'http://localhost:4001/api/board/main/checkLike'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = { idx }

        const response = await axios.post(router, data, option)
        const errNo = response.data.errno
        if (errNo !== 0) {
            // 백엔드 에러발생
            alert(response.data.errMsg)
        } else {
            if (response.data.result[0] !== undefined) {
                likeFlag.value = 1
                likeBtn.value = '❤️'
            } else {
                likeFlag.value = 0
                likeBtn.value = '♡'
            }
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }
    // likeFlag에 값 넣어주기
    // 
}


// 1. like ajax
const ajaxLike = async () => {
    try {
        const router = 'http://localhost:4001/api/board/main/like'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = {
            idx,
            likeFlag: likeFlag.value
        }
        const response = await axios.post(router, data, option)
        const errNo = response.data.errno
        if (errNo !== 0) {
            // 백엔드 에러발생
            alert(response.data.errMsg)
        } else {
            // 백엔드 정상 작동 => flag값에 따라 다르게 렌더링해주기
            if (likeFlag.value === '1') {
                alert('좋아요 취소')
                document.querySelector('#likeFlag').value = '0'
                renderLike()
            } else {
                alert('❤️')
                document.querySelector('#likeFlag').value = '1'
                renderLike()
            }
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }
}
renderLike()
likeFrm.addEventListener('submit', async (e) => {
    e.preventDefault()
    await ajaxLike()
})

// 2. scrap ajax
const scrapBtn = document.querySelector('#scrapBtn')
// const idx = document.querySelector('#idx').value
const ajaxScrap = async (router) => {
    try {
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = {
            idx
        }
        const response = await axios.post(router, data, option)
        const errNo = response.data.errno
        if (errNo === 0) {
            alert('스크랩되었습니다!')
        } else {
            alert(response.data.errMsg)
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }
}
scrapBtn.addEventListener('submit', async (e) => {
    e.preventDefault()
    await ajaxScrap('http://localhost:4001/api/board/main/scrap')
})



// 3. comment ajax
// 3-1. 댓글 인풋 클릭 시 댓글 submit 버튼 생성, 취소 누르면 사라짐
const commentForm = document.querySelector('#commentForm')
const commentInput = document.querySelector('#commentInput')
const c_userid = document.querySelector('#c_userid')
const comBtnDiv = document.querySelector('#comBtnDiv')
const cancelBtn = document.querySelector('#cancelBtn')
const commentBtn = document.querySelector('#commentBtn')

commentInput.addEventListener('focus', () => {
    comBtnDiv.style.display = 'block'
    cancelBtn.addEventListener('click', () => {
        commentInput.value = ''
        comBtnDiv.style.display = 'none'
    })
})

// 3-2. 댓글 작성 후 db에 저장 : write
commentBtn.addEventListener('click', async (e) => {
    try {
        const router = 'http://localhost:4001/api/comment/write'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = {
            bid: idx,
            comment: commentInput.value,
            c_userid: c_userid.value
        }
        const response = await axios.post(router, data, option)
        const errNo = response.data.errno
        if (errNo === 0) {
            commentInput.value = ''
            viewComment()
        } else {
            alert(response.data.errMsg)
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('axios 통신 중 문제가 발생했습니다')
    }
})

// 3-3. 댓글 불러오기 : view
viewComment()
async function viewComment() {
    try {
        const router = 'http://localhost:4001/api/comment/view'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = {
            bid: idx,
        }
        const response = await axios.post(router, data, option)
        if (response.data.errno === 0) {
            const commentArr = response.data.result
            renderComment(commentArr)
        }
        else {
            alert('db에러발생')
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('axios 통신 중 문제가 발생했습니다')
    }
}

// 3-3-1. 댓글 리스트 화면에 랜더링 해주는 함수 : view 서브함수
function renderComment(Arr) {
    const commentUl = document.querySelector('#commentUl')
    const c_template = document.querySelector('#commentTemplate').innerHTML
    const commentCount = document.querySelector('#commentCount')
    let str = ''
    Arr.forEach(v => {
        str += c_template
            .replace(/{cid}/gi, v.cid)
            .replace(/{comment}/gi, v.comment)
            .replace(/{c_date}/gi, v.c_date)
            .replace(/{c_userid}/gi, v.c_userid)
            .replace(/{parent}/gi, v.parent)
    })
    commentUl.innerHTML = str
    commentCount.innerHTML = `댓글 ${Arr.length}개`

    // 댓글삭제 addEvent
    const commentLi = document.querySelectorAll('.commentLi')
    commentLi.forEach(v => {
        v.querySelector('.comUdtBtn').addEventListener('click', updateHandler)
        v.querySelector('.comDelBtn').addEventListener('click', deleteHandler)
    })
}

// 3-4. 댓글 삭제
async function deleteHandler(e) {
    const cid = e.target.parentNode.querySelector('input').value
    try {
        const router = 'http://localhost:4001/api/comment/delete'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const data = { cid }

        const response = await axios.post(router, data, option)

        if (response.data.errno === 0) {
            viewComment()
        }
        else {
            alert('db에러발생')
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('axios 통신 중 문제가 발생했습니다')
    }
}


// 3-4. 댓글 수정
async function updateHandler(e) {
    const commentContent = e.target.parentNode.parentNode.querySelector('.commentContent')
    const cid = e.target.parentNode.querySelector('input').value
    const originalComment = commentContent.innerHTML
    commentContent.innerHTML = `<input type="text" class="cngCom" value="${originalComment}"><button class="cngBtn">수정</button>`
    const cngBtn = commentContent.querySelector('.cngBtn')
    cngBtn.addEventListener('click', updateAxios)

    async function updateAxios() {
        try {
            let cngCom = commentContent.querySelector('.cngCom').value
            const router = 'http://localhost:4001/api/comment/update'
            const option = {
                'Content-type': 'application/json',
                withCredentials: true
            }
            const data = { cid, cngCom }

            const response = await axios.post(router, data, option)

            if (response.data.errno === 0) {
                viewComment()
            }
            else {
                alert('db에러발생')
            }
        }
        catch (e) {
            console.log(`axios 통신 중 에러발생 : ${e.message}`)
            alert('axios 통신 중 문제가 발생했습니다')
        }
    }
}
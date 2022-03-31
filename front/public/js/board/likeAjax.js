// 0. renderLike : like 여부에 따라 빈하트 / 꽉찬하트 다르게 랜더링
let likeFlag = document.querySelector('.likeFlag') // 1은 누른 상태, 0은 안누른 상태 : html에 추가해주기, 백엔드에서 이 값 가져오기
const likeFrm = document.querySelector('.likeFrm')
const likeBtn = document.querySelector('.likeBtn')
const idx = document.querySelector('#idx').value
const b_userid = document.querySelector('#b_userid').value

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
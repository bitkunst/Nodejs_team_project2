
let userid = document.querySelector('#userid').value


// 1. 리스트 데이터 가져오기
const getData = async (cgArr) => {
    try {
        const router = 'http://localhost:4001/api/home/latest'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const dataObj = {
            cgArr
        }
        const response = await axios.post(router, dataObj, option)
        const errNo = response.data.errno
        const data = response.data.result.slice(0, 3) // 최신 순으로 4개까지


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

// 2. 데이터로 리스트 생성(🔥ajax로 좋아요 상태 받아오고 보여주는 함수를 여기에 넣을 거임.)
const createList = (data, userid) => {
    const latestContent = document.querySelector('#latestContent').innerHTML
    let str = ''
    data.forEach((v, i) => {
        if (v.img == undefined) { v.img = 'js1648455420407.png' }
        const hstgArr = ['', '', '', '', '']
        if (v.hashtag != undefined) { v.hashtag.split('-').slice(0, 5).forEach((v, i) => hstgArr[i] = v) }

        let likeFlag = 0
        if (v.l_userid != undefined) {
            v.l_userid.split('-').forEach(id => {
                if (id == userid) { likeFlag = 1 }
            })
        }

        str += latestContent
            .replace('{num}', i)
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
    const latestUl = document.querySelector('#latestUl')
    latestUl.innerHTML = str
    let currentPage = 1
    let viewArticle = 4
    // likeHandeler(currentPage, viewArticle)
    //const likeFrm = document.querySelectorAll('.likeFrm')

}

const showList = async () => {
    let cgArr = ['a']
    const data = await getData(cgArr)
    createList(data, userid)
}

showList()










// popular

// 1. 리스트 데이터 가져오기
const getData2 = async (cgArr) => {
    try {
        const router = 'http://localhost:4001/api/home/popular'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const dataObj = {
            cgArr
        }
        const response = await axios.post(router, dataObj, option)
        const errNo = response.data.errno
        const data = response.data.result.slice(0, 3) // 최신 순으로 4개까지


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

// 2. 데이터로 리스트 생성(🔥ajax로 좋아요 상태 받아오고 보여주는 함수를 여기에 넣을 거임.)
const createList2 = (data, userid) => {
    const popularContent = document.querySelector('#popularContent').innerHTML
    let str = ''
    data.forEach((v, i) => {
        if (v.img == undefined) { v.img = 'js1648455420407.png' }
        const hstgArr = ['', '', '', '', '']
        if (v.hashtag != undefined) { v.hashtag.split('-').slice(0, 5).forEach((v, i) => hstgArr[i] = v) }

        let likeFlag = 0
        if (v.l_userid != undefined) {
            v.l_userid.split('-').forEach(id => {
                if (id == userid) { likeFlag = 1 }
            })
        }

        str += popularContent
            .replace('{num}', i)
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
    const popularUl = document.querySelector('#popularUl')
    popularUl.innerHTML = str
    let currentPage = 1
    let viewArticle = 4
    // likeHandeler(currentPage, viewArticle)
    //const likeFrm = document.querySelectorAll('.likeFrm')

}

const showList2 = async () => {
    let cgArr = ['a']
    const data = await getData2(cgArr)
    createList2(data, userid)
}

showList2()

/*
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
                const response = await axios.post('http://localhost:4001/api/home/like', dataObj, option)
                const errNo = response.data.errno

                if (errNo === 0) {
                    showList()
                    showList2()
                } else {
                    if (errNo === 2) {
                        alert('로그인된 사용자만 ❤️ 가능')
                    }
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
*/




//userRank
async function userRank() {
    try {
        const router = 'http://localhost:4001/api/home/rank'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const dataObj = {

        }
        const response = await axios.post(router, dataObj, option)
        const errNo = response.data.errno
        const data = response.data.result // 최신 순으로 4개까지

        if (errNo === 0) {
            createRank(data)
        } else {
            console.log('백엔드에서 에러발생')
            return
        }
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }

    function createRank(data) {
        const topRankUser = document.querySelector('#topRankUser').innerHTML
        const userRankTable = document.querySelector('#userRankTable')
        let str = ''
        data.forEach((v, i) => {
            str += topRankUser
                .replace('{rank}', i + 1)
                .replace('{nickname}', v.nickname)
                .replace('{boardCount}', v.boardCount)
                .replace('{commentCount}', v.commentCount)
                .replace('{point}', v.point)
        })
        userRankTable.querySelector('tbody').innerHTML = str
    }
}

userRank()



// BNW 스크롤

//우측 네비버튼 이동
//네비버튼 DOM
const nav1Btn = document.querySelector('#nav1')
const nav2Btn = document.querySelector('#nav2')
const nav3Btn = document.querySelector('#nav3')
//이동할 div DOM
const nav1go = document.querySelector('#div2')
const nav2go = document.querySelector('#div3')
const nav3go = document.querySelector('#userMainInfo')

// //이동할 div의 절대좌표구하기
const absoluteTop1 = window.pageYOffset + nav1go.getBoundingClientRect().top;
const absoluteTop2 = window.pageYOffset + nav2go.getBoundingClientRect().top;
// const absoluteTop3 = window.pageYOffset + nav3go.getBoundingClientRect().top + parseInt(window.innerHeight / 2);

//이동할 div의 절대좌표구하기
// const absoluteTop1 = 1.2 * window.innerHeight
// const absoluteTop2 = 3.3 * window.innerHeight
const absoluteTop3 = 6 * window.innerHeight



//각각의 네비버튼에 클릭이벤트 주기
nav1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: absoluteTop1, behavior: "smooth" })
})

nav2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: absoluteTop2, behavior: "smooth" })
})

nav3Btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: absoluteTop3, behavior: "smooth" })
})


// 유저정보 가져오기 ajax
const getUserData = async () => {
    console.log('실행')
    try {
        const router = 'http://localhost:4001/api/user/profile'
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const dataObj = {
            userid
        }
        const response = await axios.post(router, dataObj, option)
        return response.data
    }
    catch (e) {
        console.log(`axios 통신 중 에러발생 : ${e.message}`)
        alert('문제가 발생했습니다')
    }
}

const createUser = (data) => {
    const userinfoBox = document.querySelector('#userinfoBox')
    if (data.uImg == undefined) { data.uImg = 'default_profileImg.jpg' }
    const str = userinfoBox.innerHTML
        .replace('{nickname}', data.nickname)
        .replace('{profilePic}', data.uImg)
        .replace('{point}', data.point)
    userinfoBox.innerHTML = str
}

const showUser = async () => {
    const data = await getUserData()
    console.log(data)
    createUser(data)
}

showUser()
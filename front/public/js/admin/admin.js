const adminContents = document.querySelectorAll('.adminContents')
const adminContent = document.querySelector('#adminContent')
const manageUser = document.querySelector('#manageUser')
const manageCg = document.querySelector('#manageCg')
const manageBoard = document.querySelector('#manageBoard')

const userList = document.querySelector('#userList > ul')
const userInfoUl = document.querySelector('#userInfo > div > #userInfoUl')
const userImgUl = document.querySelector('#userInfo > div > #userImgUl')
const userInfoDiv = document.querySelector('#userInfo > div')
const boardList = document.querySelector('#boardList')
const likesList = document.querySelector('#likesList')
const viewList = document.querySelector('#viewList')

const userListTemp = document.querySelector('#userListTemp')
const userInfoTemp = document.querySelector('#userInfoTemp')
const userImgTemp = document.querySelector('#userImgTemp')
// const boardListTemp = document.querySelector('#boardListTemp')

let userArr = []

// manageUser
manageUser.addEventListener('submit', async (e) => {
    e.preventDefault()

    for (let i = 0; i < adminContents.length; i++) {
        if (i == 0) {
            adminContents[i].setAttribute('class', 'on')
        } else {
            adminContents[i].setAttribute('class', 'off')
        }
    }

    const response = await axios.get('http://localhost:4001/api/admin/manage/user', {
        withCredentials: true
    })
    userArr = response.data
    let str = ''
    userArr.forEach(v => {
        str += userListTemp.innerHTML.replace(/{userid}/g, v.userid)
    })
    userList.innerHTML = str
    userList.style.padding = '7px 14px'
    userList.style.height = '70vh'

    const userli = document.querySelectorAll('#userList > ul > .useridList')

    for (let item of userli) {
        const userid = item.querySelector('span')
        userid.addEventListener('click', async () => {
            const useridInput = item.querySelector('#useridInput')
            const userValue = useridInput.value

            const response = await axios.get('http://localhost:4001/api/admin/manage/user/info', {
                withCredentials: true
            })
            userArr = response.data
            let str = ''
            let str2 = ''
            userArr.forEach(v => {
                if (userValue == v.userid) {
                    str += userInfoTemp.innerHTML.replace(/{userid}/g, v.userid)
                        .replace('{userpw}', v.userpw)
                        .replace('{name}', v.name)
                        .replace('{nickname}', v.nickname)
                        .replace('{address}', v.address)
                        .replace('{gender}', v.gender)
                        .replace('{mobile}', v.mobile)
                        .replace('{phone}', v.phone)
                        .replace('{email}', v.email)
                        .replace(/{point}/g, v.point)

                    str2 += userImgTemp.innerHTML.replace('{bio}', v.bio)
                }

            })
            userInfoUl.innerHTML = str
            userImgUl.innerHTML = str2
            userInfoDiv.style.padding = '12px 24px'
            userInfoDiv.style.height = '70vh'
            userInfoDiv.style.width = '75vw'

            const pointForm = document.querySelector('#pointForm')
            pointForm.addEventListener('submit', async (e) => {
                e.preventDefault()
                const apiUserid = pointForm.querySelector('#apiUserid').value
                const userPoint = pointForm.querySelector('#userPoint').value
                const payload = {
                    apiUserid,
                    userPoint
                }
                const response = await axios.post('http://localhost:4001/api/admin/manage/user/point', payload, {
                    withCredentials: true
                })
                if (response.data) {
                    alert('포인트가 지급되었습니다.')
                }
                const updatePoint = response.data[0].point
                const viewPoint = document.querySelector('#pointInfo')
                viewPoint.innerHTML = updatePoint
                pointForm.querySelector('#userPoint').value = ''
            })
        })
    }
})

// manageCg
manageCg.addEventListener('submit', (e)=>{
    e.preventDefault()

    for (let i = 0; i < adminContents.length; i++) {
        if (i == 1) {
            adminContents[i].setAttribute('class', 'on')
        } else {
            adminContents[i].setAttribute('class', 'off')
        }
    }

    // 3. comment ajax
    // 3-1. 댓글 인풋 클릭 시 댓글 submit 버튼 생성, 취소 누르면 사라짐
    const commentForm = document.querySelector('#commentForm')
    const mainInput = document.querySelector('#mainInput')
    const m_urlInput = document.querySelector('#m_urlInput')
    const comBtnDiv = document.querySelector('#comBtnDiv')
    const cancelBtn = document.querySelector('#cancelBtn')
    const commentBtn = document.querySelector('#commentBtn')

    mainInput.addEventListener('focus', () => {
        comBtnDiv.style.display = 'flex'
        cancelBtn.addEventListener('click', () => {
            mainInput.value = ''
            comBtnDiv.style.display = 'none'
        })
    })

    // 3-2. 댓글 작성 후 db에 저장 : write
    commentBtn.addEventListener('click', async (e) => {
        try {
            const main = mainInput.value
            const m_url = m_urlInput.value
            const router = 'http://localhost:4001/api/admin/manage/category/write'
            const option = {
                'Content-type': 'application/json',
                withCredentials: true
            }
            const data = {
                main, m_url
            }
            const response = await axios.post(router, data, option)
            const errNo = response.data.errno
            if (errNo === 0) {
                mainInput.value = ''
                m_urlInput.value = ''
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
            const router = 'http://localhost:4001/api/admin/manage/category/view'
            const option = {
                'Content-type': 'application/json',
                withCredentials: true
            }
            const response = await axios.post(router, option)
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
            // alert('axios 통신 중 문제가 발생했습니다')
        }
    }

    // 3-3-1. 댓글 리스트 화면에 랜더링 해주는 함수 : view 서브함수
    function renderComment(Arr) {
        const commentUl = document.querySelector('#commentUl')
        const c_template = document.querySelector('#commentTemplate').innerHTML
        const c_template2 = document.querySelector('#commentTemplate2').innerHTML
        const commentCount = document.querySelector('#commentCount')
        let str = ''
        Arr.forEach(v => {
            if (v.idx.length == 3) {
                str += c_template
                    .replace(/{idx}/gi, v.idx)
                    .replace(/{main}/gi, v.main)
                    .replace(/{m_url}/gi, v.m_url)
                    .replace(/{sub}/gi, v.sub)
                    .replace(/{s_url}/gi, v.s_url)
            } else {
                str += c_template2
                    .replace(/{idx}/gi, v.idx)
                    .replace(/{main}/gi, v.main)
                    .replace(/{m_url}/gi, v.m_url)
                    .replace(/{sub}/gi, v.sub)
                    .replace(/{s_url}/gi, v.s_url)
            }
        })
        commentUl.innerHTML = str
        // 댓글삭제 addEvent
        const commentLi = document.querySelectorAll('.commentLi')
        commentLi.forEach(v => {
            v.querySelector('.comUdtBtn').addEventListener('click', updateHandler)
            v.querySelector('.comDelBtn').addEventListener('click', deleteHandler)
            if (v.querySelector('.reComBtn')) {
                v.querySelector('.reComBtn').addEventListener('click', replyHandler)
            }
        })
    }

    // 3-4. 댓글 삭제
    async function deleteHandler(e) {
        console.log('삭제')
        const idx = e.target.parentNode.querySelector('input').value
        try {
            const router = 'http://localhost:4001/api/admin/manage/category/delete'
            const option = {
                'Content-type': 'application/json',
                withCredentials: true
            }
            const data = { idx }

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
        const commentContent = e.target.parentNode.parentNode.parentNode.querySelector('.commentContent')
        const cid = e.target.parentNode.querySelector('input').value
        const originalComment = commentContent.innerHTML
        commentContent.innerHTML = `<input type="text" class="cngCom" value="${originalComment}"><button class="cngBtn">수정</button>`
        const cngBtn = commentContent.querySelector('.cngBtn')
        cngBtn.addEventListener('click', updateAxios)

        async function updateAxios() {
            try {
                let cngCom = commentContent.querySelector('.cngCom').value
                const router = 'http://localhost:4001/api/admin/manage/category/update'
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


    // 3-5. 대댓글 작성
    async function replyHandler(e) {
        e.target.addEventListener('click', async (e) => {
            reComDiv.style.display = 'none'
            viewComment()
        })
        const reComDiv = e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling
        const main = reComDiv.querySelector('#main')
        const subInput = reComDiv.querySelector('#subInput')
        const s_urlInput = reComDiv.querySelector('#s_urlInput')

        reComDiv.style.display = 'flex'
        const replyBtn = reComDiv.querySelector('#replyBtn')

        const replyInput = reComDiv.querySelector('#replyInput')
        subInput.addEventListener('focus', () => {
            const repBtnDiv = reComDiv.querySelector('#repBtnDiv')
            const replyCancelBtn = reComDiv.querySelector('#replyCancelBtn')

            repBtnDiv.style.display = 'flex'
            replyCancelBtn.addEventListener('click', () => {
                replyInput.value = ''
                repBtnDiv.style.display = 'none'
            })
        })

        replyBtn.addEventListener('click', replyAxios)
        async function replyAxios() {
            try {
                //const main = e.target.parentNode.parentNode.querySelector('#main').value
                //const sub = e.target.parentNode.parentNode.querySelector('#sub').value
                //const s_url = e.target.parentNode.parentNode.querySelector('#s_url').value
                const router = 'http://localhost:4001/api/admin/manage/category/reply'
                const option = {
                    'Content-type': 'application/json',
                    withCredentials: true
                }
                const data = {
                    main: main.value,
                    sub: subInput.value,
                    s_url: s_urlInput.value
                }
                console.log(data)

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

})



// manageBoard
function tableFormat(field) {
    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')
    const tdNum = document.createElement('td')
    const tdTitle = document.createElement('td')
    const tdNickname = document.createElement('td')
    const tdDate = document.createElement('td')
    const _td = document.createElement('td')

    tdNum.innerHTML = '번호'
    tdTitle.innerHTML = '제목'
    tdNickname.innerHTML = '작성자'
    tdDate.innerHTML = '작성일'
    _td.innerHTML = field
    tr.append(tdNum)
    tr.append(tdTitle)
    tr.append(tdNickname)
    tr.append(tdDate)
    tr.append(_td)
    thead.append(tr)
    table.append(thead)
    return table
}

manageBoard.addEventListener('submit', async (e) => {
    e.preventDefault()

    for (let i = 0; i < adminContents.length; i++) {
        if (i == 2) {
            adminContents[i].setAttribute('class', 'on')
        } else {
            adminContents[i].setAttribute('class', 'off')
        }
    }

    const response = await axios.get('http://localhost:4001/api/admin/manage/board', {
        withCredentials: true
    })

    const boardArr1 = response.data.board
    const boardArr2 = response.data.likes
    const boardArr3 = response.data.view

    boardList.innerHTML = ''
    likesList.innerHTML = ''
    viewList.innerHTML = ''
    const tableB = tableFormat('글관리')
    const tbodyB = document.createElement('tbody')
    boardArr1.forEach(v => {
        const tr = document.createElement('tr')
        const tdNum = document.createElement('td')
        const tdTitle = document.createElement('td')
        const tdNickname = document.createElement('td')
        const tdDate = document.createElement('td')
        const tdActive = document.createElement('td')
        const form = document.createElement('form')
        const select = document.createElement('select')
        const option1 = document.createElement('option')
        const option0 = document.createElement('option')
        const input = document.createElement('input')
        const button = document.createElement('button')
        button.innerHTML = '변경'
        button.setAttribute('type', 'submit')
        input.setAttribute('type', 'hidden')
        input.setAttribute('value', `${v.idx}`)
        input.setAttribute('class', 'boardIdx')
        option0.innerHTML = '내리기'
        option1.innerHTML = '보이기'
        option0.setAttribute('value', '0')
        option1.setAttribute('value', '1')
        if (v.active == 0) {
            option0.setAttribute('selected', '')
        }
        select.setAttribute('class', 'selectBox')
        form.setAttribute('class', 'boardManageForm')
        select.append(option1)
        select.append(option0)
        form.append(select)
        form.append(input)
        form.append(button)
        tdActive.append(form)
        tdNum.innerHTML = v.idx
        tdTitle.innerHTML = v.title
        tdNickname.innerHTML = v.nickname
        tdDate.innerHTML = v.date
        tr.append(tdNum)
        tr.append(tdTitle)
        tr.append(tdNickname)
        tr.append(tdDate)
        tr.append(tdActive)
        tbodyB.append(tr)
    })
    tableB.append(tbodyB)
    boardList.append(tableB)

    const tableL = tableFormat('좋아요')
    const tbodyL = document.createElement('tbody')
    boardArr2.forEach(v => {
        const tr = document.createElement('tr')
        const tdNum = document.createElement('td')
        const tdTitle = document.createElement('td')
        const tdNickname = document.createElement('td')
        const tdLikes = document.createElement('td')
        const tdDate = document.createElement('td')

        tdNum.innerHTML = v.idx
        tdTitle.innerHTML = v.title
        tdNickname.innerHTML = v.nickname
        tdLikes.innerHTML = v.likes
        tdDate.innerHTML = v.date
        tr.append(tdNum)
        tr.append(tdTitle)
        tr.append(tdNickname)
        tr.append(tdDate)
        tr.append(tdLikes)
        tbodyL.append(tr)
    })
    tableL.append(tbodyL)
    likesList.append(tableL)

    const tableV = tableFormat('조회수')
    const tbodyV = document.createElement('tbody')
    boardArr3.forEach(v => {
        const tr = document.createElement('tr')
        const tdNum = document.createElement('td')
        const tdTitle = document.createElement('td')
        const tdNickname = document.createElement('td')
        const tdView = document.createElement('td')
        const tdDate = document.createElement('td')

        tdNum.innerHTML = v.idx
        tdTitle.innerHTML = v.title
        tdNickname.innerHTML = v.nickname
        tdView.innerHTML = v.view
        tdDate.innerHTML = v.date
        tr.append(tdNum)
        tr.append(tdTitle)
        tr.append(tdNickname)
        tr.append(tdDate)
        tr.append(tdView)
        tbodyV.append(tr)
    })
    tableV.append(tbodyV)
    viewList.append(tableV)

    const boardManageForm = document.querySelectorAll('.boardManageForm')
    for (let item of boardManageForm) {
        const boardIdx = item.querySelector('.boardIdx').value
        const selectBox = item.querySelector('.selectBox')
        // const selected = selectBox.options[selectBox.selectedIndex].value
        item.addEventListener('submit', async (e) => {
            e.preventDefault()
            const payload = {
                selected: selectBox.value,
                boardIdx
            }
            const response = await axios.post('http://localhost:4001/api/admin/manage/board', payload, {
                withCredentials: true
            })
            if (response.data) {
                alert('해당 게시글이 변경되었습니다.')
            }
        })
    }
})


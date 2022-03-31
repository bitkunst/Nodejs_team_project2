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
manageUser.addEventListener('submit', async (e)=>{
    e.preventDefault()

    for (let i=0; i<adminContents.length; i++) {
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
        userid.addEventListener('click', async ()=>{
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
            pointForm.addEventListener('submit', async (e)=>{
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

// manageBoard
manageBoard.addEventListener('submit', async (e)=>{
    e.preventDefault()

    for (let i=0; i<adminContents.length; i++) {
        if (i == 1) {
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
        item.addEventListener('submit', async (e)=>{
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
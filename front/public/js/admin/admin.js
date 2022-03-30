const manageUser = document.querySelector('#manageUser')
const manageCg = document.querySelector('#manageCg')
const manageBoard = document.querySelector('#manageBoard')

const userList = document.querySelector('#userList > ul')
const userInfoUl = document.querySelector('#userInfo > div > #userInfoUl')
const userImgUl = document.querySelector('#userInfo > div > #userImgUl')
const userInfoDiv = document.querySelector('#userInfo > div')

const userListTemp = document.querySelector('#userListTemp')
const userInfoTemp = document.querySelector('#userInfoTemp')
const userImgTemp = document.querySelector('#userImgTemp')

// let userid
let userArr = []

manageUser.addEventListener('submit', async (e)=>{
    e.preventDefault()
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


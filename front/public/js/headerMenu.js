const getCgMenu = async () => {
    try {
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const boardData = { currentBoard: 'main' }
        const router = 'http://localhost:4001/api/board/writeCategory'
        const response = await axios.post(router, boardData, option)
        const errNo = response.data.errno
        const data = response.data.result
        const userInfo = response.data.userInfo.userid
        if (errNo === 0) {
            return { data, userInfo }
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

const createCgMenu = async () => {
    const navimenu = document.querySelector('#navimenu')

    const dataObj = await getCgMenu()
    const data = dataObj.data
    const userInfo = dataObj.userInfo
    const isLogin = document.querySelector('#isLogin')
    if (userInfo != undefined) {
        //로그아웃
        isLogin.innerHTML = isLogin.innerHTML.replace('{login}', 'logout').replace('{loginStr}', '로그아웃')
    } else {
        // 로그인
        isLogin.innerHTML = isLogin.innerHTML.replace('{login}', 'login').replace('{loginStr}', '로그인')
    }

    let str = ''
    let sub = ''
    data.forEach((v, i) => {
        let mainStr = '<h3><a class="mainCg" href="/board/main/list/{m_url}"> {main} </a></h3>'
        let subStr = '<li><a class="subCg" href="/board/main/list/{m_url}/{s_url}">&nbsp;👉&nbsp;{sub}</a></li>'
        if (v.idx.length === 3 && i == 0) {
            mainStr = mainStr.replace('{m_url}', v.m_url)
                .replace('{main}', v.main)
            str += '<li>' + mainStr
        }
        else if (v.idx.length === 3) {
            mainStr = mainStr.replace('{m_url}', v.m_url)
                .replace('{main}', v.main)

            str += '<ul>' + sub + '</ul> </li> <li>' + mainStr
            sub = ''
        } else {
            sub += subStr.replace('{m_url}', v.m_url)
                .replace('{s_url}', v.s_url)
                .replace('{sub}', v.sub)
        }
    })
    const cgStr = str + '<ul>' + sub + '</ul></li>'
    navimenu.innerHTML += cgStr
}

createCgMenu()
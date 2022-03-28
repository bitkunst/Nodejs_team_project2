// 필요한 것
// 1. 게시판 선택 -> 카테고리 선택 : axios로 db에서 받아와서 구현하기 ⭕️
// 2. 파일 선택 가능 여부는 선택된 게시판에 따라 달라짐 ⭕️
// 3. 일반 사용자에게는 게시판 선택 항목 중 공지사항은 보이지 않게 : 로그인 완성 후 구현예정
// 4. 파일 선택 multiple인데 최대 개수 정해주기 : 최대 갯수 넘어가면 등록 버튼 비활성화 ⭕️
// 5. 기본 게시판은 접근한 게시판 종류로 선택된 상태

// 6. update로 접근 시 기존의 카테고리로 설정


const boardPath = document.location.href;
const fileInput = document.querySelector('#fileInput')
const boardSelect = document.querySelector('#boardSelect')
const boardMenu = document.querySelectorAll('.boardMenu')


let currentBoard = boardPath.split('/')[4] // 접근한 보드
if (currentBoard !== 'main') {
    fileInput.style.display = 'none'
} else { fileInput.style.display = 'block' }

// 화면 로드 시 접근한 게시판 종류로 게시판 selected 된 상태
boardMenu.forEach(v => {
    if (v.value === currentBoard) {
        v.setAttribute('selected', '')
    }
})


const init = async () => {
    currentBoard = boardSelect.value
    if (currentBoard !== 'main') {
        fileInput.style.display = 'none'
    }
    else {
        fileInput.style.display = 'block'
    }
    const data = await getCg(currentBoard)
    createCg(data)

    // write가 아닌 update로 접근 시 기존글의 카테고리를 바로 띄워주기 & submit버튼 활성화
    if (boardPath.split('/')[5] === 'update') {
        const updateCg = document.querySelector('#updateCg').value
        const cgMenu = document.querySelectorAll('.cgMenu')
        cgMenu.forEach(v => {
            console.log(updateCg, v.value)
            if (v.value === updateCg) {
                v.setAttribute('selected', '')
            }
        })
        if (cgSelect.value != '' && title.value != '' && fileInput.files.length <= 5) {
            submitBtn.disabled = false
        }
        else { submitBtn.disabled = true }
    }
}

// 게시판 선택 이벤트 발생 시 파일 업로드 인풋 보이기/안보이기
boardSelect.addEventListener('change', init)


// 게시판 종류 선택 후 해당 게시판 관련 카테고리 데이터 가져오기
const getCg = async (currentBoard) => {
    try {
        const option = {
            'Content-type': 'application/json',
            withCredentials: true
        }
        const boardData = { currentBoard }
        const router = 'http://localhost:4001/api/board/writeCategory'
        const response = await axios.post(router, boardData, option)
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

// 카테고리 데이터를 받아오면 그걸로 select의 옵션 생성
const createCg = (data) => {
    const cgOption = document.querySelector('#cgOption').innerHTML
    let str = '<option value selected>카테고리 선택</option>'
    data.forEach((v, i) => {
        str += cgOption
            .replace('{idx}', v.idx)
            .replace('{cgName}', v.sub == null ? v.main : v.main + v.sub)
    })
    const cgSelect = document.querySelector('#cgSelect')
    cgSelect.innerHTML = str
}

// submit 버튼 활성화

const submitBtn = document.querySelector('#submitBtn')
const cgSelect = document.querySelector('#cgSelect')
const title = document.querySelector('#title')
submitBtn.disabled = true // 기본은 disabled

//submit 버튼 활성화 조건 확인 함수 : 파일 첨부 후, 카테고리 선택 후, 글 제목 입력 후 실행
const activeSubmit = () => {
    if (cgSelect.value != '' && title.value != '' && fileInput.files.length <= 5) {
        submitBtn.disabled = false
    }
    else { submitBtn.disabled = true }
}

// 파일 업로드 최대 수 정해주기
fileInput.addEventListener('change', () => {
    console.log(fileInput.files.length)
    if (fileInput.files.length > 5) {
        alert('파일 첨부는 5개까지 가능합니다')
    }
    activeSubmit()
})

cgSelect.addEventListener('change', () => {
    activeSubmit()
})

title.addEventListener('change', () => {
    activeSubmit()
})

init()

// ❗️ 추가할 부분 
// 페이지에 접근한 유저가 관리자인지 확인 후 아니라면 게시판 종류에서 공지사항 항목 없애기
// 카테고리 미선택, 제목 미등록 시 파일 등록 못하도록 submit 버튼 막기


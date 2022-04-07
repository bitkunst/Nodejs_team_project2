const input = document.querySelector(".finder__input")
const finder = document.querySelector(".finder")
const form = document.querySelector("form")
const searchInput = document.querySelector('#searchInput')
const content = document.querySelector('#content')
const userInfo = document.querySelector('#userInfo')
const searchTemplate = document.querySelector('#searchTemplate')
const userTemplate = document.querySelector('#userTemplate')
const contentBox = document.querySelector('#contentBox')

input.addEventListener("focus", () => {
    finder.classList.add("active")
});

input.addEventListener("blur", () => {
    if (input.value.length === 0) {
        finder.classList.remove("active")
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    finder.classList.add("processing");
    finder.classList.remove("active");
    input.disabled = true;
    setTimeout(() => {
        finder.classList.remove("processing");
        input.disabled = false;
    if (input.value.length > 0) {
        finder.classList.add("active");
    }
    }, 1000);
  
    const data = searchInput.value
    const payload = {
        data
    }
    const response = await axios.post('http://localhost:4001/api/search', payload, {
        withCredentials: true
    })

    getUser(response.data)

});

// (page-1)*num
// page*num - 1

function scrollPaging(arr, num) {
    const viewData = {}
    let viewArr = []
    const total_page = Math.ceil(arr.length/num)
    for (let i=1; i<=total_page; i++) {
        // let start = (i-1)*num
        let end = (i*num)-1
        for(let j=0; j<=end; j++) {
            if ((j+1) > arr.length) { break }
            viewArr.push(j)
        }
        viewData[i] = viewArr
        viewArr = []
    }
    return viewData
}

function getUser(data) {
    userInfo.innerHTML = ''
    let str = ''
    if(data[0].nickname == searchInput.value) {
        if (data[0].uImg == null) {
            data[0].uImg = 'http://localhost:4001/profile_img/default_profileImg.jpg'
        }
        str += userTemplate.innerHTML.replace('{nickname}', data[0].nickname)
        .replace('{email}', data[0].email)
        .replace('{bio}', data[0].bio)
        .replace('{uImg}', data[0].uImg)
    } else {
        str = ''
    }
    userInfo.innerHTML = str
}

// function makeList(data, page) {
//     content.innerHTML = ''
//     let str = ''
//     const scrollData = scrollPaging(data, 5)
//     console.log('배열?', scrollData)

//     scrollData[page].forEach(v => {
//         str += searchTemplate.innerHTML.replace('{idx}', data[v].idx)
//                                        .replace('{category}', data[v].board_name)
//                                        .replace('{title}', data[v].title)
//                                        .replace('{nickname}', data[v].nickname)
//                                        .replace('{date}', data[v].date)
//                                        .replace('{summary}', data[v].content)
//                                        .replace('{img}', data[v].img)
//     })
//     content.innerHTML = str
// }

function makeList(data) {
    content.innerHTML = ''
    let str = ''
    data.forEach(v => {
        if (v.sub == null) {
            v.sub = '' 
        }
        if (v.img == null) {
            v.img = 'no_image.jpg'
        }
        if (v.hstg == null) {
            v.hstg = ''
        }
        str += searchTemplate.innerHTML.replace('{idx}', v.idx)
                                       .replace('{category}', (v.main + '/' + v.sub))
                                       .replace('{title}', v.title)
                                       .replace('{nickname}', v.nickname)
                                       .replace('{date}', v.date)
                                       .replace('{summary}', v.content)
                                       .replace('{img}', v.img)
                                       .replace('{url}', ('board/' + v.board_name + '/view/' + v.idx))
                                       .replace('{hstg}', v.hstg)
    })
    content.innerHTML = str
}


async function getData() {
    userInfo.innerHTML = ''
    content.innerHTML = ''
    const data = searchInput.value
    const payload = {
        data
    }
    const response = await axios.post('http://localhost:4001/api/search', payload, {
        withCredentials: true
    })
    // console.log(response.data.result)
    if (response.data.length > 0) {
        // let page = 1
        // makeList(response.data, page)
        // console.log(window.innerHeight + window.scrollY)
        // window.addEventListener('scroll', ()=>{
        //     let val = window.innerHeight + window.scrollY
        //     console.log(val)
        //     console.log(val >= document.body.offsetHeight)
        //     if (val >= document.body.offsetHeight) {
        //         console.log('페이지?', page)
        //         page++
        //         makeList(response.data, page)
        //     }
        // })
        // if (window.innerHeight >= document.body.offsetHeight) {
        //     console.log('페이지?', page)
        //     makeList(response.data, page)
        // }

        makeList(response.data)
    }
}



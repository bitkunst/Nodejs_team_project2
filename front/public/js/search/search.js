const input = document.querySelector(".finder__input")
const finder = document.querySelector(".finder")
const form = document.querySelector("form")
const search = document.querySelector('#search')
const content = document.querySelector('#content')
const searchTemplate = document.querySelector('#searchTemplate')

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
  
    const data = search.value
    const payload = {
        data
    }
    const response = await axios.post('http://localhost:4001/api/search', payload, {
        withCredentials: true
    })

    makeList(response.data)

});

function makeList(data) {
    content.innerHTML = ''
    let str = ''
    data.forEach(v => {
        str += searchTemplate.innerHTML.replace('{idx}', v.idx)
                            .replace('{category}', v.board_name)
                            .replace('{title}', v.title)
                            .replace('{date}', v.date)
                            .replace('{summary}', v.content)
    })
    console.log(str)
    content.innerHTML = str
}


async function getData() {

    content.innerHTML = ''
    const data = search.value
    const payload = {
        data
    }
    const response = await axios.post('http://localhost:4001/api/search', payload, {
        withCredentials: true
    })
    console.log(response.data)
    if(response.data.length > 0) {
        makeList(response.data)
    }
}



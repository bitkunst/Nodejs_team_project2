const input = document.querySelector(".finder__input")
const finder = document.querySelector(".finder")
const form = document.querySelector("form")
const search = document.querySelector('#search')
const content = document.querySelector('#content')
const table = document.querySelector('#table')

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
    console.log(data)
    const payload = {
        data
    }
    const response = await axios.post('http://localhost:4001/api/search', payload, {
        withCredentials: true
    })

    makeList(response.data)

});

function makeList(data) {
    table.innerHTML = ''
    data.forEach(v => {
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
    
        td1.innerHTML = v.idx
        td2.innerHTML = v.title
        td3.innerHTML = v.nickname
        td4.innerHTML = v.date
        td5.innerHTML = v.view
        tr.append(td1)
        tr.append(td2)
        tr.append(td3)
        tr.append(td4)
        tr.append(td5)
        table.append(tr)
        console.log(table)
    })
    content.append(table)
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



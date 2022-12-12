const baseURL = "https://esdexamen.tk/"

const retrievePostsButton = document.querySelector('.retrievePosts')
retrievePostsButton.addEventListener('click', displayPosts) //displayPosts


const usernameRegister = document.querySelector("#usernameRegister")
const passwordRegister = document.querySelector("#passwordRegister")
const regButton = document.querySelector("#register")


const mainContainer = document.querySelector('#mainContainer')

let token = null
function clearMainContainer(){
    mainContainer.innerHTML=""
}

function display(content){
    clearMainContainer()
    mainContainer.innerHTML=content
}

function getPostTemplate(post){

    let timeStamp = post.createdAt
    let time = timeStamp.substring(11,16)

    let day = timeStamp.substring(8,10)
    let month = timeStamp.substring(5,7)
    let year = timeStamp.substring(2,4)
    let date = day +"/"+month+"/"+year

    let template = `
        <div class="card">
             <p class="badge text-secondary fw-normal ms-2">${time}, ${date}</p>
             <div class="card-body">
                <h5 class="card-title">${post.user.username}</h5>
                <p class="card-text">${post.content}</p>
            </div>
        </div>
    `
    return template

}

function getPostsTemplate(posts) {
        let postsTemplate = ""
        posts['hydra:member'].forEach(post=>{
            postsTemplate+=  getPostTemplate(post)
        })
        return postsTemplate
}
async function getPostsFromAPI(){
    let url = `${baseURL}b1devweb/api/posts`
    let fetchParams = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
    return await fetch(url, fetchParams)
        .then(response => response.json())
        .then(posts => {
            console.log(posts['hydra:member'])
            return posts
        })
}
async function displayPosts() {
    let container = ""
    getPostsFromAPI().then(post => {
        container += getPostsTemplate(post)
        display(container)
        console.log('dans displayPosts')
    })
}


regButton.addEventListener('click', register)
function register(){
    let url = `${baseURL}b1devweb/api/registeruser`
    let body = {
        username: usernameRegister.value,
        password: passwordRegister.value
    }
    let fetchParams = {
        method: "POST",
        body: JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}


loginButton.addEventListener("click", loginToGetAToken)

function loginToGetAToken() {
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')

    let url = `${baseURL}b1devweb/api/login_check`
    let body = {
        username: usernameLogin.value,
        password: passwordLogin.value
    }
    let fetchParams = {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            console.log(data.token)
            if(data.token){
                token = data.token;

            }
        })
}

/*
function createPost(){
    let url = `${baseURL}b1devweb/api/post`
    let body = {
        content: messageField.value
    }
    let bodySerialise = JSON.stringify(body)
    let fetchParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise
    }

    return await fetch(url, fetchParams)
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                //console.log(message.id)
            })
            return messages
        })
}
*/


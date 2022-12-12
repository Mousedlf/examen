const baseURL = "https://esdexamen.tk/"

const retrievePostsButton = document.querySelector('.retrievePosts')
retrievePostsButton.addEventListener('click', displayPosts) //displayPosts


const usernameRegister = document.querySelector("#usernameRegister")
const passwordRegister = document.querySelector("#passwordRegister")
const regButton = document.querySelector("#register")
const registerPopUp = document.querySelector('.register')

const sendButton = document.querySelector("#sendPost")
sendButton.addEventListener("click", createPost)



const mainContainer = document.querySelector('#mainContainer')

let token = null
let myUsername;

function clearMainContainer(){
    mainContainer.innerHTML=""
}


const refreshMessages = document.querySelector('#refresh')
refreshMessages.addEventListener('click', displayPosts)

function display(content){
    clearMainContainer()
    mainContainer.innerHTML=content
}

// TEMPLATES
function getPostTemplate(post){

    let timeStamp = post.createdAt
    let time = timeStamp.substring(11,16)

    let day = timeStamp.substring(8,10)
    let month = timeStamp.substring(5,7)
    let year = timeStamp.substring(2,4)
    let date = day +"/"+month+"/"+year

    let template
        if(post.user.username == myUsername){
            template = `
                    <div class="card m-3">
                          <div class="card-header d-flex justify-content-between bg-dark text-white align-items-center">
                               <h6 class="card-title mb-0">${post.user.username}</h6>
                               <div>
                                   <p class="badge fw-normal mb-0">${time}, ${date}</p>
                                   <i id="${post.id}" class="delete ms-2 fa-solid fa-trash"></i>
                               </div>
                          </div>
                          <div class="card-body d-flex flex-column">
                              <p class="mb-2">${post.content}</p>
                              <a href="#" class="btn btn-link mb-4 text-end">See more</a>
                              <div>
                                  <div class="input-group mb-3">
                                  <input type="text" class="postContent form-control" placeholder="Type in your new and improved message then press on the pen">
                                   <span class="input-group-text" id="basic-addon2"><i id="${post.id}" class="edit fa-solid fa-pen"></i></span>
                                   </div>
                              </div>
                          </div>
                    </div>
                    `
        } else {
            template = `
                    <div class="card m-2">
                          <div class="card-header d-flex justify-content-between bg-success align-items-center">
                               <h6 class="card-title mb-0">${post.user.username}</h6>
                               <p class="badge fw-normal mb-0">${time}, ${date}</p>
                          </div>
                          <div class="card-body d-flex flex-column">
                              <p class="mb-2">${post.content}</p>
                              <a href="#" class="btn btn-link text-secondary text-end">See more</a>
                          </div>

                    </div>
                    `
        }
    return template

}
function getPostsTemplate(posts) {
        let postsTemplate = ""
        posts['hydra:member'].forEach(post=>{
            postsTemplate+=  getPostTemplate(post)
        })
        return postsTemplate
}

// FETCH POSTS
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
            //console.log(posts['hydra:member'])
            return posts
        })
}


// FAIRE APPARAITRE REGISTER
const displayRegisterPageButton = document.querySelector("#displayRegisterPage")
displayRegisterPageButton.addEventListener("click", displayRegistry)
function displayRegistry() {
    registerPopUp.classList.remove('d-none')
}


// AFFICHER LES POSTS
async function displayPosts() {
    let postContainer = ""
    getPostsFromAPI().then(post => {
        postContainer += getPostsTemplate(post)
        display(postContainer)

        // All delete buttons
        const delButtons = document.querySelectorAll('.delete')
        delButtons.forEach(delButton =>{
            delButton.addEventListener('click', ()=>{
                deleteMyPost(delButton.id)
            })
        })

        // All edit buttons
        const editButtons = document.querySelectorAll('.edit')
        editButtons.forEach(editButton =>{
            editButton.addEventListener('click', ()=>{
                editMyPost(editButton.id)
            })
        })
    })
}

// INSCRIPTION
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

// LOGIN
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
            if (data.token) {
                token = data.token;
                myUsername = usernameLogin.value;
                displayPosts()
                yourUsername.innerHTML = 'Welcome ' + usernameLogin.value + '!'
                errorMessageLogin.innerHTML = ""
                registerPopUp.classList.add('d-none')
                passwordLogin.value = ""
                usernameLogin.value = ""
            } else {
                errorMessageLogin.innerHTML = "Username and password don't match. Try again."
            }
        })
}


// CREER POST
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
    fetch(url, fetchParams)
        displayPosts()
        messageField.value = ""
}

// EFFACER POST : fonctionne mais faut reload la page à chaque fois..
function deleteMyPost(id){
    let url = `${baseURL}b1devweb/api/posts/${id}`
    let fetchParams = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return  fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => displayPosts)
}

// EDIT POST
function editMyPost(id){
    const postContent = document.querySelector('.postContent')
    let url =`${baseURL}b1devweb/api/posts/${id}`
    let body = {
        content: postContent.value
    }
    let fetchParams = {
        method : 'PUT',
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body : JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            displayPosts()
        })
}



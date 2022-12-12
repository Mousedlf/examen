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


// VIDER ET AFFICHER
function clearMainContainer(){
    mainContainer.innerHTML= ""
}
function display(content){
    clearMainContainer()
    mainContainer.innerHTML=content
}
const refreshMessages = document.querySelector('#refresh')
refreshMessages.addEventListener('click', displayPosts)


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
                    <div id="${post.id}" class="card m-3">
                          <div class="card-header d-flex justify-content-between bg-dark text-white align-items-center">
                               <h6 class="card-title mb-0">${post.user.username}</h6>
                               <div>
                                   <p class="badge fw-normal mb-0">${time}, ${date}</p>
                                   <i id="${post.id}" class="delete ms-2 fa-solid fa-trash"></i>
                               </div>
                          </div>
                          <div class="card-body d-flex flex-column">
                              <p class="mb-2">${post.content}</p>
                              <a href="#" class="seeMore btn btn-link mb-4 text-end">See more</a>
                              <div class="input-group mb-3">
                                  <input type="text" class="postContent form-control" placeholder="Type in your new and improved message then press on the pen">
                                  <span class="input-group-text" id="basic-addon2"><i id="${post.id}" class="edit fa-solid fa-pen"></i></span>
                              </div>
                          </div>
                    </div>
                    `
        } else {
            template = `
                    <div id="${post.id}" class="card m-2">
                          <div class="card-header d-flex justify-content-between bg-success align-items-center">
                               <h6 class="card-title mb-0">${post.user.username}</h6>
                               <p class="badge fw-normal mb-0">${time}, ${date}</p>
                          </div>
                          <div class="card-body d-flex flex-column">
                              <p class="mb-2">${post.content}</p>
                              <a id="${post.id}" href="#" class="seeMore btn btn-link text-secondary text-end">See more</a>
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
function getCommentTemplate(comment){
    let template
    if(comment.user.username == myUsername){
        template = `
                    <div class="card m-3">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h6 class="card-title mb-0 fw-bold">${comment.user.username}:</h6>
                            <p class="mb-2">${comment.content}</p>
                        </div>
                        <i id="${comment.id}" class="delete ms-2 fa-solid fa-trash"></i>
                    </div>
                    <div class="input-group mt-3">
                        <input type="text" class="postContent form-control" placeholder="Type in your new comment then press on the pen">
                        <span class="input-group-text" id="basic-addon2"><i id="${comment.id}" class="edit fa-solid fa-pen"></i></span>
                    </div>
                </div>
            </div>
                    `
    } else {
        template = `
                    <div class="card m-3">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title mb-0 fw-bold">${comment.user.username}:</h6>
                            <p class="mb-2">${comment.content}</p>
                        </div>
                    </div>
                    `
    }
    return template
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

        // All "see more buttons"
        const seeMoreButtons = document.querySelectorAll('.seeMore')
        seeMoreButtons.forEach(seeMoreButton =>{
            seeMoreButton.addEventListener('click', ()=>{
               console.log("vers page unique pour article")
                displayOnePost(seeMoreButton.id)
            })
        })
    })
}

// AFFICHER UN SEUL POST
function displayOnePost(id){
    let url = `${baseURL}b1devweb/api/posts/${id}`
    let fetchParams = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(post => {
            let comments = post.comments
            comments.forEach(comment =>{
                console.log(comment)
                getCommentTemplate(comment)
            })
            display(getPostTemplate(post))

        })
}


let messagesAndMessageField = ""

getMessagesFromApi().then(messages=>{


    messagesAndMessageField+=getMessagesTemplate(messages)
    messagesAndMessageField+=getMessageFieldTemplate()

    display(messagesAndMessageField)

    const messageField = document.querySelector("#messageField")

    const sendButton = document.querySelector("#sendMessage")
    sendButton.addEventListener("click", sendMessage)


})


// FAIRE APPARAITRE REGISTER
const displayRegisterPageButton = document.querySelector("#displayRegisterPage")
displayRegisterPageButton.addEventListener("click", displayRegistry)
function displayRegistry() {
    registerPopUp.classList.remove('d-none')
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
    console.log('choucroute')
    messageField.value = ""
}

// EFFACER POST
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


/*
// COMMENTER UN POST
function commentPost(postId){
    let url = `${baseURL}b1devweb/api/comment/${postIid}`
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
    console.log('wut am i doing')
    getCommentTemplate()
}

// DELETE COMMENT
function deleteMyComment(id){
    let url = `${baseURL}b1devweb/api/comments/${id}`
    let fetchParams = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return  fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            console.log('delete comment')
        })
}

// EDIT COMMENT
function editMyComment(id){
    const commentContent = document.querySelector('.commentContent')
    let url =`${baseURL}b1devweb/api/posts/${id}`
    let body = {
        content: commentContent.value
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
            console.log('edit comment')
            //displayPosts()
        })
}

*/


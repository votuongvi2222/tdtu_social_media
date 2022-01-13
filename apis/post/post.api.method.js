require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getPosts(success, error){
    fetch(url + "/posts", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getPost(id, success, error){
    fetch(url + "/post/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deletePost(id,success, error){
    fetch(url+"/post/"+id, {
        method:'delete',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>{
        data.json()
    })
    .then(success)
    .catch(error)
}

function updatePost(id, post,success, error){
    fetch(url+"/post/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(post)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addPost(post,success, error){
    fetch(url+"/post", {
        method:'post',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(post)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getPost: getPost,
    getPosts: getPosts,
    updatePost: updatePost,
    deletePost: deletePost,
    addPost: addPost
}
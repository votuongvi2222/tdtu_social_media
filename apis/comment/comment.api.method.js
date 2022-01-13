require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getComments(success, error){
    fetch(url + "/comments", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getComment(id, success, error){
    fetch(url + "/comment/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteComment(id,success, error){
    fetch(url+"/comment/"+id, {
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

function updateComment(id, comment,success, error){
    fetch(url+"/comment/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(comment)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addComment(comment,success, error){
    fetch(url+"/comment", {
        method:'comment',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(comment)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getComment: getComment,
    getComments: getComments,
    updateComment: updateComment,
    deleteComment: deleteComment,
    addComment: addComment
}
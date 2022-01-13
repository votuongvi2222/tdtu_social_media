require('dotenv').config();
let url = process.env.DOMAIN_URLs
const fetch = require ("cross-fetch")

function getLikes(success, error){
    fetch(url + "/likes", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getLike(id, success, error){
    fetch(url + "/like/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteLike(id,success, error){
    fetch(url+"/like/"+id, {
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

function updateLike(id, like,success, error){
    fetch(url+"/like/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(like)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addLike(like,success, error){
    fetch(url+"/like", {
        method:'like',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(like)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getLike: getLike,
    getLikes: getLikes,
    updateLike: updateLike,
    deleteLike: deleteLike,
    addLike: addLike
}
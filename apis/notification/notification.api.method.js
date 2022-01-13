require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getNotifications(success, error){
    fetch(url + "/notifications", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getNotification(id, success, error){
    fetch(url + "/notification/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteNotification(id,success, error){
    fetch(url+"/notification/"+id, {
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

function updateNotification(id, notification,success, error){
    fetch(url+"/notification/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(notification)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addNotification(notification,success, error){
    fetch(url+"/notification", {
        method:'notification',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(notification)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getNotification: getNotification,
    getNotifications: getNotifications,
    updateNotification: updateNotification,
    deleteNotification: deleteNotification,
    addNotification: addNotification
}
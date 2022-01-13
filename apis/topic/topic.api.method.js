require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getTopics(success, error){
    fetch(url + "/topics", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getTopic(id, success, error){
    fetch(url + "/topic/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteTopic(id,success, error){
    fetch(url+"/topic/"+id, {
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

function updateTopic(id, topic,success, error){
    fetch(url+"/topic/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(topic)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addTopic(topic,success, error){
    fetch(url+"/topic", {
        method:'topic',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(topic)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getTopic: getTopic,
    getTopics: getTopics,
    updateTopic: updateTopic,
    deleteTopic: deleteTopic,
    addTopic: addTopic
}
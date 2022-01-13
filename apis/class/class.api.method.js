require('dotenv').config();
let url = process.env.DOMAIN_URL
// 'https://tdtusocialmedia.herokuapp.com/api/v1' ||
const fetch = require ("cross-fetch")

function getClses(success, error){
    fetch(url + "/clses", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getCls(id, success, error){
    fetch(url + "/cls/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteCls(id,success, error){
    fetch(url+"/cls/"+id, {
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

function updateCls(id, cls,success, error){
    fetch(url+"/cls/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(cls)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addCls(cls,success, error){
    fetch(url+"/cls", {
        method:'post',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(cls)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getCls: getCls,
    getClses: getClses,
    updateCls: updateCls,
    deleteCls: deleteCls,
    addCls: addCls
}
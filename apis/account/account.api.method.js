require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getAccounts(success, error){
    fetch(url + "/accounts", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getAccount(id, success, error){
    fetch(url + "/account/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteAccount(id,success, error){
    fetch(url+"/account/"+id, {
        method:'delete',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function updateAccount(id, account,success, error){
    fetch(url+"/account/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(account)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addAccount(account,success, error){
    fetch(url+"/account", {
        method:'post',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(account)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getAccount: getAccount,
    getAccounts: getAccounts,
    updateAccount: updateAccount,
    deleteAccount: deleteAccount,
    addAccount: addAccount
}
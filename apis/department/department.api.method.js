require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getDepartments(success, error){
    fetch(url + "/departments", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getDepartment(id, success, error){
    fetch(url + "/department/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteDepartment(id,success, error){
    fetch(url+"/department/"+id, {
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

function updateDepartment(id, department,success, error){
    fetch(url+"/department/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(department)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addDepartment(department,success, error){
    fetch(url+"/department", {
        method:'post',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(department)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getDepartment: getDepartment,
    getDepartments: getDepartments,
    updateDepartment: updateDepartment,
    deleteDepartment: deleteDepartment,
    addDepartment: addDepartment
}
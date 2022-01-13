require('dotenv').config();
let url = process.env.DOMAIN_URL
const fetch = require ("cross-fetch")

function getStudents(success, error){
    fetch(url + "/students", {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getStudent(id, success, error){
    fetch(url + "/student/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function getStudentByAccId(id, success, error){
    fetch(url + "/student/acc/" + id, {
        method:'get',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}

function deleteStudent(id,success, error){
    fetch(url+"/student/"+id, {
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

function updateStudent(id, student,success, error){
    fetch(url+"/student/"+id, {
        method:'put',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(student)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
function addStudent(student,success, error){
    fetch(url+"/student", {
        method:'post',
        headers:{
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(student)
    })
    .then(data=>data.json())
    .then(success)
    .catch(error)
}
module.exports = {
    getStudent: getStudent,
    getStudentByAccId: getStudentByAccId,
    getStudents: getStudents,
    updateStudent: updateStudent,
    deleteStudent: deleteStudent,
    addStudent: addStudent
}
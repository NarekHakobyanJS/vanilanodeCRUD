
fetch('http://localhost:3003/api/users/1', {
    method : "PATCH",
    headers : {
        "Content-Type" : "application/json"
    },
    body : JSON.stringify({name : "Narek", age : 29})
})
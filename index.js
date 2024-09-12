const http = require('http');
const fs = require('fs');
const usersDB = require('./users.json');

http.createServer((req, res) => {

    if(req.url === '/api/users' && req.method === "GET"){
        res.write(JSON.stringify(usersDB))
        res.end()
    }
    else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET"){
        let id = req.url.split('/')[3]
        let searchUser = usersDB.find((u) => u.id == id)
        
        if(searchUser){
            res.writeHead(200, {"Content-Type" : "application/json"})
            res.write(JSON.stringify(searchUser))
            res.end()
        }else {
            res.end("404 error")
        }
    }
    else if(req.url.includes("?") && req.method === "GET"){
        let searchIndex = req.url.indexOf('?');

        let queryParams = req.url.slice(searchIndex + 1)
        let query = queryParams.split('=')[1]
        let filtredArray = usersDB.filter((u) => u.name.toUpperCase().indexOf(query.toUpperCase()) > -1)
        res.write(JSON.stringify(filtredArray))
        res.end()
    }
    else if(req.url === '/api/users' && req.method === "POST"){
        let body = [];
        req.on('data', chunk => body.push(chunk));
        
        req.on('end', () => {
            body = JSON.parse(body[0].toString());
            let newDB = [...usersDB, body]
            
            fs.unlink('./users.json', (err) => {
                fs.appendFile('./users.json', JSON.stringify(newDB), () => {
                    res.write(JSON.stringify(body))
                    res.end()
                })
            })
           
        })
    }
    else if(req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "PATCH"){
        let id = req.url.split('/')[3]

        let body = [];
        req.on('data', chunk => body.push(chunk));
        
        
        req.on('end', () => {
            body = JSON.parse(body[0].toString());
            
            let newArr = usersDB.map((elem) => {
                if(elem.id == id) {
                    return {
                        ...elem,
                        ...body
                    }
                }else {
                    return elem;
                }
            })

           fs.unlink('./users.json', (err) => {
                fs.appendFile('./users.json', JSON.stringify(newArr), () => {
                    // res.write(JSON.stringify(body))
                    res.end()
                })
            })
            
            
           
        })
        res.end()
    }
    else {
        
        
        res.end()
    }
}).listen(3003, (err) => console.log("server is runnning!!"))



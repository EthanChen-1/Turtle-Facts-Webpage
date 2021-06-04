const http = require('http');
const https = require('https');
const fs = require('fs');
const port = 3000;
const turtle_server = http.createServer();
turtle_server.on("request", request_handler);
function request_handler(request, response){
    console.log(`New request for ${request.url} from ${request.socket.remoteAddress}`);
    if(request.url === "/"){
        const turtle_form = fs.createReadStream('../html/main-page.html');
        response.writeHead(200, {'Content-Type':'text/html'});
        turtle_form.pipe(response);
    }
    else if(request.url === "/favicon.ico"){
        const favicon = fs.createReadStream("../images/favicon.ico");
        response.writeHead(200, { "Content-type": "image/x-icon" });
        favicon.pipe(response);
        console.log("favicon uploaded");
    }
    else if(request.url === "/css/style-main.css"){
        const style_sheet = fs.createReadStream('../css/style-main.css');
        response.writeHead(200, {'Content-Type':'text/css'});
        style_sheet.pipe(response);
        console.log("main style sheet uploaded");
    }
    else if(request.url === "/css/style-turtle.css"){
        const turtle_style_sheet = fs.createReadStream('../css/style-turtle.css');
        response.writeHead(200, {'Content-Type':'text/css'});
        turtle_style_sheet.pipe(response);
        console.log("turtle style sheet uploaded");
    }
    else if(request.url.startsWith("/search")){
        let turtle_species = new URL(`https://example.org${request.url}`).searchParams.get("choice")
        turtle_req_handler(turtle_species, response);
    }
    else{
        console.log("404 error");
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(`<h1>404 Not Found</h1>`);
    }
}

//When our user inputs a turtle species to search for
function turtle_req_handler(turtle_species, response){
    const turtle_arr = fs.readdir("../html/turtle-species-facts", {encoding:"utf8"}, (err, files) => {
        if(err){
            console.log(err);
        } else {
            for(let i = 0; i < files.length; i++){
                if(files[i].includes(turtle_species)){
                    const fact_page = fs.createReadStream(`../html/turtle-species-facts/${files[i]}`);
                    response.writeHead(200, {'Content-Type':'text/html'})
                    fact_page.pipe(response);
                }
            }
        }
    });
}

turtle_server.on("listening", listening_handler);
function listening_handler(){
    console.log(`Now Listening on port:${port}`);
}
turtle_server.listen(port);

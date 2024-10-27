const http = require('http');
const api = require("./api.js");
const files = require("./files.js");

http.createServer(function(request, response) {
    response.statusCode = 418;
    response.setHeader('Content-Type','text');

    let path = request.url.split('/');

    if(path[1] == "api"){
        api.manage(request,response);
    }
    else{
        files.manage(request,response);
    }


}).listen(8000);


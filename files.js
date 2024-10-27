const path = require('path');
const url = require('url');
const fs = require('fs');

const front = 'front';
const mimeTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', 
    '.doc': 'application/msword',
    '.md': 'text/plain',
    'default': 'application/octet-stream'
};


function manageRequest(request, response) {
    response.statusCode = 200;

    var pathName = url.parse(front + request.url).pathname;
    var extension = path.parse(front + request.url).ext;
    console.log(pathName)
    
    try{
        let element = fs.statSync(pathName);
        element.isDirectory();
        fs.readFile(pathName, function(error, data) {
            if(error){
                console.log(error);
            }
            else{
                response.setHeader('Content-type', mimeTypes[extension]);
                response.end(data);
            }
        });

    }

    catch(error){
        console.log('le fichier n’existe pas.');
    }
    
}

exports.manage = manageRequest;
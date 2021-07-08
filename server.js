var http = require('http');
var fs = require('fs');
var server = http.createServer( function(request, response) {
    console.log("url: "+request.url);
    response.writeHead(200, {'Content-type': 'text/html'} );
    var myReadStream = fs.createReadStream(__dirname+'/index.html','utf8');
    myReadStream.pipe(response);
});
server.listen(8000,'127.0.0.1');
console.log("server start in port 8000 ");


// var express = require('express');
// var app = express();

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/',function(req, res) {
//     res.sendFile(__dirname + '/index.html');
//     res.send()
// });
// app.listen(8000)
var http = require('http'),
    fs = require('fs');

http.createServer(function (req, res) {

    console.log(req.url);

    if(req.url == '/'){

        fs.readFile(__dirname + '/public/index.html', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }else{
        if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
            fs.readFile(__dirname + '/public' + req.url, function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
        if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'
            fs.readFile(__dirname + '/public' + req.url, function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data);
                res.end();
            });
        }
        if(req.url.indexOf('.png') != -1){ //req.url has the pathname, check if it conatins '.png'
            fs.readFile(__dirname + '/public' + req.url, function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.write(data);
                res.end();
            });
        }
    }

}).listen(8080, '127.0.0.1');
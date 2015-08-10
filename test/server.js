var express = require('express');
var app = express();

app.use(express.static(__dirname+'/data'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Test server running at http://%s:%s', host, port);
});

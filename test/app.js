var express = require('express');
var app = module.exports = express();

app.use(express.static(__dirname+'/data'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});
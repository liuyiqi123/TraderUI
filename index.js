var path = require('path');
var express = require('express');
var ejs = require('ejs');
var fs = require("fs");

var app = express();

// import config data
var conf = fs.readFileSync('assets/mainfest.json');
var confData = JSON.parse(conf);

// import mock data
var mock = fs.readFileSync('_mock/datalist.json');
var dataList = JSON.parse(mock);

// set ejs, and docs path
app.set('views', path.join(__dirname, 'docs'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index', {
        base: confData,
        data: dataList.data
    });
});

app.use(express.static(path.join(__dirname, '')));

app.listen(1234);

console.log('app listening at http://localhost:1234');

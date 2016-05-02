const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const bracks_parser = require('../bracks-parser.js');
const app = express();
var server = http.createServer(app);

server.listen(3000, function() {
  console.log('test server listening at port 3000..');
});

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

app.use(bracks_parser('./bracks'));

app.get('/testhtml', function(req, res, next) {
  fs.createReadStream(path.join(process.cwd(), 'views', 'index-html.html'), 'utf8').pipe(res);
});

app.get('/testejs', function(req, res, next) {
  fs.createReadStream(path.join(process.cwd(), 'views', 'index-ejs.ejs'), 'utf8').pipe(res);
});

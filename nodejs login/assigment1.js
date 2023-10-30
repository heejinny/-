//202035107 권희진
var http = require('http');
var url = require('url');
var template = require('./author.js'); // 경로 수정
var db = require('./db.js');

db.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        var html = template.HTML('WEB', ''); // 빈 문자열로 authors 전달
        response.writeHead(200);
        response.end(html);

    } else if (pathname === '/author') {
        db.query(`SELECT * FROM author`, function (error, authors) {
            if (error) {
                throw error;
            }
            var list = '<ul>';
            authors.forEach(function (author) {
                list += `<li>${author.id}. <a href="/">${author.name}</a></li>`;
            });
            list += '</ul>';
            var html = template.HTML('WEB', list);
            response.writeHead(200);
            response.end(html);
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3001);

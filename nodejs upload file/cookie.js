var express = require('express');
var app = express();
var cookie = require('cookie');
app.get('/', function (request, response) {
  // response.writeHead(200, {
  //   'Set-Cookie':
  //     ['yummy_cookie=choco',
  //       'tasty_cookie=strawberry',
  //       `Permanent=cookies;Max-Age=${60 * 60 * 24 * 30}` //초단위 지정으로 30일동안 유효
  //     ]
  // });

  if (request.headers.cookie != undefined) {
    var cookies = cookie.parse(request.headers.cookie);
    console.log(request.headers.cookie);
    console.log(cookies.yummy_cookie);
    console.log(cookies.Permanent);
  }

  response.end('Cookie!!');
});
app.listen(3000, () => console.log('Cookie Test'))
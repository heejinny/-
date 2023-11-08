const express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  user: 'root',
  password: '6336',
  database: 'webdb2023'
};
var sessionStore = new MySqlStore(options);
const app = express();

// var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extends: false }))

var url = require('url');
var qs = require('querystring');
var path = require('path');
var cookie = require('cookie');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var db = require('./lib/db');
// var author = require('./lib/author');
// var topic = require('./lib/topic');
var authorRouter = require('./router/authorRouter');
var rootRouter = require('./router/rootRouter');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

app.use(express.static('public'));

app.use('/', rootRouter);
app.use('/author', authorRouter);

app.listen(3000, function () {
  console.log('3000!');
});

// 로그인
// app.get('/login', (req, res) => {
//   topic.login(req, res);
// })
// app.post('/login_process', (req, res) => {
//   topic.login_process(req, res);
// })
// app.get('/logout_process', (req, res) => {
//   topic.logout_process(req, res);
// })

// 메인 관리
// app.get('/', (req, res) => {
//   topic.home(req, res);
// })
// app.get('/page/:pageId', (req, res) => {
//   topic.page(req, res);
// })
// app.get('/create', (req, res) => {
//   topic.create(req, res);
// })
// app.post('/create_process', (req, res) => {
//   topic.create_process(req, res);
// })
// app.get('/update/:pageId', (req, res) => {
//   topic.update(req, res);
// })
// app.post('/update_process', (req, res) => {
//   topic.update_process(req, res);
// })
// app.get('/delete/:pageId', (req, res) => {
//   topic.delete_process(req, res);
// })
// app.get('/topic', (req, res) => {
//   topic.home(req, res);
// })

// 저자 관리
// app.get('/author', (req, res) => {
//   author.home(req, res);
// })
// app.post('/author/create_process', (req, res) => {
//   author.create_process(req, res);
// })
// app.get('/author/update/:pageId', (req, res) => {
//   author.update(req, res);
// })
// app.post('/author/update_process', (req, res) => {
//   author.update_process(req, res);
// })
// app.get('/author/delete/:pageId', (req, res) => {
//   author.delete_process(req, res);
// })

// app.use(function (req, res, next) {
//   if (!req.session.views) {
//     req.session.views = {};
//   }
//   var pathname = parseurl(req).pathname;
//   req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
//   next();
// });

// app.get('/', function (req, res, next) {
//   console.log("hello")
//   console.log(req.session);
//   if (req.session.num === undefined) {
//     req.session.num = 1;
//   }
//   else {
//     req.session.num += 1;
//   }
//   res.send(`Hello session : ${req.session.num}`);
// });

// app.listen(3000, () => console.log('Example app listening on port 3000'));



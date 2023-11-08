// 202035107 권희진

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

module.exports = {
  signup: (req, res) => {
    var context = {
      menu: 'menuForCustomer.ejs',
      who: '손님',
      body: 'signup.ejs',
      logined: 'NO'
    };
    req.app.render('home', context, (err, html) => {
      res.end(html);
    })
  },
  signup_process: (req, res) => {
    var post = req.body;
    var sanitizedid = sanitizeHtml(post.id);
    var sanitizedpwd = sanitizeHtml(post.pwd);
    var sanitizedname = sanitizeHtml(post.name);
    var sanitizedaddress = sanitizeHtml(post.address);
    var sanitizedtel = sanitizeHtml(post.tel);
    var sanitizedbirth = sanitizeHtml(post.birth);
    var customerclass = '02';
    var customerpoint = 0;

    if (!sanitizedid || !sanitizedpwd || !sanitizedname || !sanitizedaddress || !sanitizedtel || !sanitizedbirth) {
      return res.status(400).send("입력값을 확인해주세요.");
    }

    db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, class, point)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      [sanitizedid, sanitizedpwd, sanitizedname, sanitizedaddress, sanitizedtel, sanitizedbirth, customerclass, customerpoint], (error, result) => {
        res.writeHead(302, { Location: `/` });
        res.end();
      }
    );
  },
  login: (req, res) => {
    var context = {
      menu: 'menuForCustomer.ejs',
      who: '손님',
      body: 'login.ejs',
      logined: 'NO'
    };
    req.app.render('home', context, (err, html) => {
      res.end(html);
    })
  },
  login_process: (req, res) => {
    var post = req.body;
    db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results) => {
      if (results[0].num === 1) {
        db.query('select name, class from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result) => {
          req.session.is_logined = true;
          req.session.name = result[0].name
          req.session.class = result[0].class
          res.redirect('/');
        })
      }
      else {
        req.session.is_logined = false;
        req.session.name = '손님';
        req.session.class = '99';
        res.redirect('/');
      }
    })
  },
  logout_process: (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/');
    })
  }
}
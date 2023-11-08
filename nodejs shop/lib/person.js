// 202035107 권희진

const sanitizeHtml = require('sanitize-html');
var db = require('./db');

function authIsOwner(req, res) {
  if (req.session.is_logined) {
    return true;
  }
  else {
    return false
  }
}

module.exports = {
  view: (req, res) => {
    var vu = req.params.vu;
    db.query('SELECT * FROM person', (error, results) => {
      var context = {
        menu: 'menuForManager.ejs',
        who: req.session.name,
        body: 'person.ejs',
        logined: 'YES',
        page: vu,
        num: results.length,
        list: results,
      };
      req.app.render('home', context, (err, html) => {
        res.end(html);
      })
    })
  },
  create: (req, res) => {
    var context = {
      menu: 'menuForManager.ejs',
      who: req.session.name,
      body: 'personCU.ejs',
      logined: 'YES',
      page: 'create',
      list: null
    };
    req.app.render('home', context, (err, html) => {
      res.end(html)
    })
  },
  create_process: (req, res) => {
    var post = req.body;
    console.log(post)
    sanitizeLoginid = sanitizeHtml(post.loginid)
    sanitizePassword = sanitizeHtml(post.password)
    sanitizeName = sanitizeHtml(post.name)
    sanitizeAddress = sanitizeHtml(post.address)
    sanitizeTel = sanitizeHtml(post.tel)
    sanitizeBirth = sanitizeHtml(post.birth)
    sanitizeClass = sanitizeHtml(post.class)
    sanitizePoint = sanitizeHtml(post.point)

    db.query('INSERT INTO person (loginid, password, name, address, tel, birth, class, point) VALUES(?,?,?,?,?,?,?,?)',
      [sanitizeLoginid, sanitizePassword, sanitizeName, sanitizeAddress,
        sanitizeTel, sanitizeBirth, sanitizeClass, sanitizePoint], (error, result) => {
          if (error) {
            console.error(error)
          }
          res.writeHead(302, { Location: `/person/view/u` });
          res.end();
        });
  },
  update: (req, res) => {
    var loginid = req.params.loginid;
    db.query('SELECT * FROM person WHERE loginid=?', [loginid], (err, result) => {
      var context = {
        menu: 'menuForManager.ejs',
        who: req.session.name,
        body: 'personCU.ejs',
        logined: 'YES',
        page: 'update',
        list: result,
      };
      req.app.render('home', context, (err, html) => {
        res.end(html)
      })
    })
  },
  update_process: (req, res) => {
    var post = req.body;
    sanitizeLoginid = sanitizeHtml(post.loginid)
    sanitizeid = sanitizeHtml(post.id)
    sanitizePassword = sanitizeHtml(post.password)
    sanitizeName = sanitizeHtml(post.name)
    sanitizeAddress = sanitizeHtml(post.address)
    sanitizeTel = sanitizeHtml(post.tel)
    sanitizeBirth = sanitizeHtml(post.birth)
    sanitizeClass = sanitizeHtml(post.class)
    sanitizePoint = sanitizeHtml(post.point)

    db.query('UPDATE person SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, class=?, point=? WHERE loginid=?',
      [sanitizeid, sanitizePassword, sanitizeName, sanitizeAddress,
        sanitizeTel, sanitizeBirth, sanitizeClass, sanitizePoint, sanitizeLoginid], (error, result) => {
          res.writeHead(302, { Location: `/person/view/u` });
          res.end();
        });
  },
  delete_process: (req, res) => {
    var loginId = req.params.loginid;
    db.query('DELETE FROM person WHERE loginid=?', [loginId], (error, result) => {
      res.writeHead(302, { Location: `/person/view/u` });
      res.end();
    })
  }
}
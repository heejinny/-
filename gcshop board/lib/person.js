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
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class === '01') {
        menubar = 'menuForManager.ejs'
      } else {
        menubar = 'menuForCustomer.ejs'
      }
      logined = 'YES'
    } else {
      menubar = 'menuForCustomer.ejs'
      logined = 'NO'
      req.session.name = '손님'
    }
    var vu = req.params.vu;
    var sql1 = `SELECT * from boardtype;`
    var sql2 = `SELECT * FROM person;`
    db.query(sql1 + sql2, (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results[0],
        body: 'person.ejs',
        logined: logined,
        page: vu,
        num: results[1].length,
        list: results[1],
      };
      req.app.render('home', context, (err, html) => {
        res.end(html);
      })
    })
  },
  create: (req, res) => {
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class === '01') {
        menubar = 'menuForManager.ejs'
      } else {
        menubar = 'menuForCustomer.ejs'
      }
      logined = 'YES'
    } else {
      menubar = 'menuForCustomer.ejs'
      logined = 'NO'
      req.session.name = '손님'
    }
    db.query(`SELECT * from boardtype`, (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results,
        body: 'personCU.ejs',
        logined: logined,
        page: 'create',
        list: null
      };
      req.app.render('home', context, (err, html) => {
        res.end(html)
      })
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
    var isOwner = authIsOwner(req, res);
    if (isOwner) {
      if (req.session.class === '01') {
        menubar = 'menuForManager.ejs'
      } else {
        menubar = 'menuForCustomer.ejs'
      }
      logined = 'YES'
    } else {
      menubar = 'menuForCustomer.ejs'
      logined = 'NO'
      req.session.name = '손님'
    }
    var loginid = req.params.loginid;
    db.query('SELECT * from boardtype', (err, results) => {
      db.query('SELECT * FROM person WHERE loginid=?', [loginid], (err, result) => {
        var context = {
          menu: menubar,
          who: req.session.name,
          boardtypes: results,
          body: 'personCU.ejs',
          logined: logined,
          page: 'update',
          list: result,
        };
        req.app.render('home', context, (err, html) => {
          res.end(html)
        })
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
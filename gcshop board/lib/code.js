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
    var sql2 = `SELECT * FROM code_tbl;`
    db.query(sql1 + sql2, (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results[0],
        body: 'code.ejs',
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
        body: 'codeCU.ejs',
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
    sanitizeMain_id = sanitizeHtml(post.main_id)
    sanitizeMain_name = sanitizeHtml(post.main_name)
    sanitizeSub_id = sanitizeHtml(post.sub_id)
    sanitizeSub_name = sanitizeHtml(post.sub_name)
    sanitizeStart = sanitizeHtml(post.start)
    sanitizeEnd = sanitizeHtml(post.end)

    db.query('INSERT INTO code_tbl (main_id, main_name, sub_id, sub_name, start, end) VALUES(?,?,?,?,?,?)',
      [sanitizeMain_id, sanitizeMain_name, sanitizeSub_id, sanitizeSub_name, sanitizeStart, sanitizeEnd], (error, result) => {
        res.writeHead(302, { Location: `/code/view/u` });
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
    var mainId = req.params.main;
    var subId = req.params.sub;
    db.query(`SELECT * from boardtype`, (err, results) => {
      db.query('SELECT * FROM code_tbl WHERE main_id=? AND sub_id=?', [mainId, subId], (err, result) => {
        console.log(result)
        var context = {
          menu: menubar,
          who: req.session.name,
          boardtypes: results,
          body: 'codeCU.ejs',
          logined: logined,
          page: 'update',
          list: result,
        };
        console.log(context)
        req.app.render('home', context, (err, html) => {
          res.end(html)
        })
      })
    })
  },
  update_process: (req, res) => {
    var post = req.body;
    console.log(post)
    sanitizeMain_name = sanitizeHtml(post.main_name)
    sanitizeSub_name = sanitizeHtml(post.sub_name)
    sanitizeStart = sanitizeHtml(post.start)
    sanitizeEnd = sanitizeHtml(post.end)
    sanitizeMain_id = sanitizeHtml(post.main_id)
    sanitizeSub_id = sanitizeHtml(post.sub_id)

    db.query('UPDATE code_tbl SET main_name=?, sub_name=?, start=?, end=? WHERE main_id=? AND sub_id=?',
      [sanitizeMain_name, sanitizeSub_name, sanitizeStart, sanitizeEnd, sanitizeMain_id, sanitizeSub_id], (error, result) => {
        res.writeHead(302, { Location: `/code/view/u` });
        res.end();
      });
  },
  delete_process: (req, res) => {
    var mainId = req.params.main;
    var subId = req.params.sub;
    db.query('DELETE FROM code_tbl WHERE main_id=? AND sub_id=?', [mainId, subId], (error, result) => {
      res.writeHead(302, { Location: `/code/view/u` });
      res.end();
    })
  }
}
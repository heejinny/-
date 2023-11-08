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
    db.query('SELECT * FROM code_tbl', (error, results) => {
      var context = {
        menu: 'menuForManager.ejs',
        who: req.session.name,
        body: 'code.ejs',
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
      body: 'codeCU.ejs',
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
    var mainId = req.params.main;
    var subId = req.params.sub;
    db.query('SELECT * FROM code_tbl WHERE main_id=? AND sub_id=?', [mainId, subId], (err, result) => {
      console.log(result)
      var context = {
        menu: 'menuForManager.ejs',
        who: req.session.name,
        body: 'codeCU.ejs',
        logined: 'YES',
        page: 'update',
        list: result,
      };
      console.log(context)
      req.app.render('home', context, (err, html) => {
        res.end(html)
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
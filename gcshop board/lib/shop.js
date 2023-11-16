// 202035107 권희진

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
  home: (req, res) => {
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
    var category = req.params.category
    var isOwner = authIsOwner(req, res);
    var vu = ''
    db.query('SELECT count(*) as num FROM merchandise', (error, results) => {
      var num = results[0].num;
      var sql1 = `SELECT * from boardtype;`
      var sql2 = `SELECT * FROM merchandise;`
      db.query(sql1 + sql2, (error, results) => {
        var context = {
          menu: menubar,
          who: req.session.name,
          logined: logined,
          boardtypes: results[0],
          body: 'merchandise.ejs',
          page: vu,
          num: num,
          list: results[1],
          category: category
        };
        console.log(context)
        req.app.render('home', context, (err, html) => {
          res.end(html);
        })
      })
    })
  }
}
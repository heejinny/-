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
      if (req.session.class === '00') {
        var context = {
          menu: 'menuForManager.ejs',
          who: req.session.name,
          body: 'items.ejs',
          logined: 'YES'
        };
        req.app.render('home', context, (err, html) => {
          res.end(html);
        })
      }
      else if (req.session.class === '01') {
        var vu = ''
        var num = 0
        db.query('SELECT count(*) as num FROM merchandise', (error, results) => {
          num = results[0].num;
          db.query('SELECT image, name, price, brand FROM merchandise;', (error, results) => {
            var context = {
              menu: 'menuForManager.ejs',
              who: req.session.name,
              body: 'merchandise.ejs',
              logined: 'YES',
              page: vu,
              num: num,
              list: results,
            };
            req.app.render('home', context, (err, html) => {
              if (err) {
                console.error(err)
              }
              res.end(html);
            })
          })
        })
      }
      else if (req.session.class === '02') {
        var context = {
          menu: 'menuForCustomer.ejs',
          who: req.session.name,
          body: 'items.ejs',
          logined: 'YES'
        };
        req.app.render('home', context, (err, html) => {
          res.end(html);
        })
      }
    }
    else {
      var context = {
        menu: 'menuForCustomer.ejs',
        who: '손님',
        body: 'items.ejs',
        logined: 'NO'
      };
      req.app.render('home', context, (err, html) => {
        res.end(html);
      })
    }
  }
}
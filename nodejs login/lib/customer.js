const db = require('./db');
var qs = require('querystring');

module.exports = {
  home: (req, res) => {

    db.query('SELECT * FROM customer', (error, cusomers) => {
      var c = '<a href="/create">create</a>'
      var b = '<h2>Welcome</h2><p>Node.js Start Page</p>'

      var context = {
        list: cusomers,
        control: c,
        body: b
      };
      req.app.render('home', context, (err, html) => {
        res.end(html)
      })
    });
  },
  page: (req, res) => {
    var id = req.params.pageId;
    db.query('SELECT * FROM customer', (error, cusomers) => {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM customer WHERE id = ${id}`, (error2, customer) => {
        if (error2) {
          throw error2;
        }

        var c = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${customer[0].id}">update</a>&nbsp;&nbsp;<a href="/delete/${customer[0].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a>`
        var b = `<p>이름 : ${customer[0].name}</p><p>주소 : ${customer[0].address}</p><p>생년월일 : ${customer[0].birth}</p><p>전화번호 : ${customer[0].tel}</p>`

        var context = {
          list: cusomers,
          control: c,
          body: b
        };
        res.app.render('home', context, (err, html) => {
          res.end(html)
        })
      })
    });
  },
  create: (req, res) => {
    db.query(`SELECT * FROM customer`, (error, cusomers) => {
      if (error) {
        throw error;
      }
      var context = {
        list: cusomers,
        control: `<a href="/create">create</a>`,
        body: `<form action="/create_process" method="post">
                                        <p><input type="text" name="name" placeholder="name"></p>
                                        <p><textarea name="address" placeholder="address"></textarea></p>
                                        <p><input type="text" name="birth" placeholder="birth"></p>
                                        <p><input type="text" name="tel" placeholder="tel"></p>
                                        <p><input type="submit"></p></form>`
      };
      req.app.render('home', context, (err, html) => {
        res.end(html);
      });
    });
  },
  create_process: (req, res) => {
    var body = '';
    req.on('data', (data) => {
      body = body + data;
    });
    req.on('end', () => {
      var post = qs.parse(body);
      db.query(`
                    INSERT INTO customer (name, address, birth, tel)
                        VALUES(?, ?, ?, ?)`,
        [post.name, post.address, post.birth, post.tel], (error, result) => {
          if (error) {
            throw error;
          }

          //res.writeHead(302, {Location: `/page/${result.insertId}`});
          res.redirect(`/page/${result.insertId}`)
          res.end();
        }
      );
    });
  },
  update: (req, res) => {
    var _url = req.url;
    //var queryData = url.parse(_url, true).query;
    id = req.params.pageId;
    db.query('SELECT * FROM customer', (error, cusomers) => {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM customer WHERE id=?`, [id], (error2, customer) => {
        if (error2) {
          throw error2;
        }
        var context = {
          list: cusomers,
          control: `<a href="/create">create</a> <a href="/update/${customer[0].id}">update</a>`,
          body: `<form action="/update_process" method="post">
                                        <input type="hidden" name="id" value="${customer[0].id}">
                                        <p><input type="text" name="name" placeholder="name" value="${customer[0].name}"></p>
                                        <p><textarea name="address" placeholder="address">${customer[0].address}</textarea></p>
                                        <p><input type="text" name="birth" placeholder="birth" value="${customer[0].birth}"></p>
                                        <p><input type="text" name="tel" placeholder="tel" value="${customer[0].tel}"></p>
                                        <p><input type="submit"></p>
                                        </form>`
        };
        req.app.render('home', context, (err, html) => {
          res.end(html);
        });

      });
    });
  },
  update_process: (req, res) => {
    var body = '';
    req.on('data', (data) => {
      body = body + data;
    });
    req.on('end', () => {
      var post = qs.parse(body);
      db.query('UPDATE customer SET name=?, address=?, birth=?, tel=? WHERE id=?',
        [post.name, post.address, post.birth, post.tel, post.id], (error, result) => {
          res.writeHead(302, { Location: `/page/${post.id}` });
          res.end();
        });
    });
  },

  delete_process: (req, res) => {
    id = req.params.pageId;
    db.query('DELETE FROM customer WHERE id = ?', [id], (error, result) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/` });
      res.end();
    });
  }
}
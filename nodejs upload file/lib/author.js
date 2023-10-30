const db = require('./db');
const fs = require('fs');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

function authIsOwner(req, res) {
  if (req.session.is_logined) { return true; }
  else {
    return false
  }
}

function authStatusUI(req, res) {
  var login = '<a href="/login">login</a>';
  if (authIsOwner(req, res)) {
    login = '<a href="/logout_process">logout</a>';
  }
  return login;
}

module.exports = {
  home: (req, res) => {
    if (authIsOwner(req, res) === false) {
      res.end(`<script type='text/javascript'>alert("Login required")
      <!--
      setTimeout("location.href='http://localhost:3000'",1000);
      //-->
      </script>`)
    }
    db.query('SELECT * FROM topic', (error, topics) => {
      db.query('SELECT * FROM author', (err, authors) => {
        var login = ''
        login = authStatusUI(req, res);
        var i = 0;
        var tag = '<table border = "1" style="border-collapse: collapse;">'
        while (i < authors.length) {
          tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td><a
    href="/author/update/${i}">update</a></td><td><a href="/author/delete/${authors[i].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a></td>`
          i += 1;
        }
        tag = tag + '</table>'

        var b = `<form action="/author/create_process" method="post">
    <p><input type = "text" name = "name" placeholder = "name"></p>
    <p><input type = "text" name = "profile" placeholder = "profile"></p>
    <p><input type="submit" value ="생성"></p>
    </form> `

        var context = {
          lg: login,
          title: 'Author list',
          list: topics,
          control: tag,
          body: b
        };
        console.log(context)
        req.app.render('home', context, (err, html) => {
          res.end(html)
        })
      });
    });
  },
  page: (req, res) => {
    var id = req.params.pageId;
    db.query('SELECT * FROM author', (error, authors) => {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM author WHERE id = ${id}`, (error2, author) => {
        if (error2) {
          throw error2;
        }
        var login = ''
        login = authStatusUI(req, res);
        var c = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${author[0].id}">update</a>&nbsp;&nbsp;<a href="/delete/${author[0].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a>`
        var b = `<h2>${author[0].name}</h2><p>${author[0].profile}</p>`

        var context = {
          lg: login,
          title: 'Author list',
          list: authors,
          control: c,
          bxody: b
        };
        res.app.render('home', context, (err, html) => {
          res.end(html)
        })
      })
    });
  },
  create: (req, res) => {
    db.query(`SELECT * FROM author`, (error, authors) => {
      if (error) {
        throw error;
      }
      var login = ''
      login = authStatusUI(req, res);
      var context = {
        lg: login,
        title: 'Author list',
        list: authors,
        control: `<a href="/create">create</a>`,
        body: `<form action="/create_process" method="post">
                                        <p><input type="text" name="name" placeholder="name"></p>
                                        <p><textarea name="profile" placeholder="profile"></textarea></p>
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
      sanitizedName = sanitizeHtml(post.name)
      sanitizedProfile = sanitizeHtml(post.profile)
      db.query(`
    INSERT INTO author (name, profile)
    VALUES(?, ?)`,
        [sanitizedName, sanitizedProfile], (error, result) => {
          if (error) {
            throw error;
          }
          //res.writeHead(302, {Location: `/page/${result.insertId}`});
          res.redirect(`/author`)
          res.end();
        }
      );
    });
  },
  update: (req, res) => {
    var id = req.params.pageId;
    console.log(id);
    db.query('SELECT * FROM topic', (error, topics) => {
      if (error) {
        throw error;
      }
      db.query('SELECT * FROM author', (error2, authors) => {
        if (error2) {
          throw error2;
        }

        var login = ''
        login = authStatusUI(req, res);

        var i = 0;
        var tag = '<table border = "1" style="border-collapse: collapse;">'
        while (i < authors.length) {
          tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td><a
  href="/author/update/${i}">update</a></td><td><a href="/author/delete/${i}">delete</a></td>`
          i += 1;
        }
        tag = tag + '</table>'
        var b = `<form action="/author/update_process" method="post">
    <input type="hidden" name="id" value="${authors[id].id}">
          <p><input type = "text" name = "name" placeholder = "name" value="${authors[id].name}"></p>
          <p><input type = "text" name = "profile" placeholder = "profile" value="${authors[id].profile}"></p>
          <p><input type="submit" value ="수정"></p>
          </form> `


        var context = {
          lg: login,
          title: 'Author list',
          list: topics,
          control: tag,
          body: b
        };
        req.app.render('home', context, (err, html) => {
          res.end(html)
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
      var sanitizedName = sanitizeHtml(post.name);
      var sanitizedProfile = sanitizeHtml(post.profile);

      db.query('UPDATE author SET name=?, profile=? WHERE id=?',
        [sanitizedName, sanitizedProfile, post.id], (error, result) => {
          res.writeHead(302, { Location: `/author` });
          res.end();
        });
    });
  },

  // delete_process: (req, res) => {
  //   id = req.params.pageId;
  //   db.query('DELETE FROM author WHERE id = ?', [id], (error, result) => {
  //     if (error) {
  //       throw error;
  //     }
  //     res.writeHead(302, { Location: `/author` });
  //     res.end();
  //   });
  // }

  delete_process: (req, res) => {
    id = req.params.pageId;
    db.query('DELETE FROM author WHERE id = ?', [id], (error, result) => {
      if (error) {
        throw error;
      }
      res.writeHead(302, { Location: `/author` });
      res.end();
    });
  }
}
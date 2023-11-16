// 202035107 권희진

const sanitizeHtml = require('sanitize-html');
var db = require('./db');
const { dateOfEightDigit } = require('./template')

function authIsOwner(req, res) {
  if (req.session.is_logined) {
    return true;
  }
  else {
    return false
  }
}

module.exports = {
  typeview: (req, res) => {
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
    console.log(req.session.name)
    db.query(`SELECT * from boardtype`, (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results,
        body: 'boardtype.ejs',
        auth: req.session.class,
        logined: logined,
        num: results.length,
        list: results,
      };
      console.log(context)
      req.app.render('home', context, (err, html) => {
        res.end(html);
      })
    })
  },
  typecreate: (req, res) => {
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
    db.query('SELECT * from boardtype', (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results,
        body: 'boardtypeCU.ejs',
        logined: logined,
        cu: 'C',
      };
      req.app.render('home', context, (err, html) => {
        res.end(html)
      })
    })
  },
  typecreate_process: (req, res) => {
    var post = req.body;
    sanitizeTitle = sanitizeHtml(post.title)
    sanitizeDescription = sanitizeHtml(post.description)
    sanitizeNumPerPage = sanitizeHtml(post.numPerPage)
    sanitizeWrite_YN = sanitizeHtml(post.write_YN)
    sanitizeRe_YN = sanitizeHtml(post.re_YN)

    db.query('INSERT INTO boardtype (title, description, write_YN, re_YN, numPerPage) VALUES(?,?,?,?,?)',
      [sanitizeTitle, sanitizeDescription,
        sanitizeWrite_YN, sanitizeRe_YN, sanitizeNumPerPage], (error, result) => {
          res.writeHead(302, { Location: `/board/type/view` });
          res.end();
        });
  },
  typeupdate: (req, res) => {
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
    var typeId = req.params.typeId;
    db.query('SELECT * FROM boardtype', (err, results) => {
      db.query('SELECT * FROM boardtype WHERE type_id=?', [typeId], (err, result) => {
        var context = {
          menu: menubar,
          who: req.session.name,
          boardtypes: results,
          body: 'boardtypeCU.ejs',
          logined: logined,
          type_id: typeId,
          cu: 'U',
          boardtype: result,
        };
        req.app.render('home', context, (err, html) => {
          res.end(html)
        })
      })
    })
  },
  typeupdate_process: (req, res) => {
    var post = req.body;
    sanitizeType_id = sanitizeHtml(post.type_id)
    sanitizeTitle = sanitizeHtml(post.title)
    sanitizeDescription = sanitizeHtml(post.description)
    sanitizeNumPerPage = sanitizeHtml(post.numPerPage)
    sanitizeWrite_YN = sanitizeHtml(post.write_YN)
    sanitizeRe_YN = sanitizeHtml(post.re_YN)

    db.query('UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? WHERE type_id=?',
      [sanitizeTitle, sanitizeDescription,
        sanitizeWrite_YN, sanitizeRe_YN, sanitizeNumPerPage, sanitizeType_id], (error, result) => {
          res.writeHead(302, { Location: `/board/type/view` });
          res.end();
        });
  },
  typedelete_process: (req, res) => {
    var typeId = req.params.typeId;
    db.query('DELETE FROM boardtype WHERE type_id=?', [typeId], (error, result) => {
      res.writeHead(302, { Location: `/board/type/view` });
      res.end();
    })
  },



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
    var sntzedTypeId = sanitizeHtml(req.params.typeId);
    var pNum = req.params.pNum;
    var sql1 = `SELECT * from boardtype;`
    var sql2 = `SELECT * from boardtype where type_id = ${sntzedTypeId};`
    var sql3 = `SELECT count(*) as total from board where type_id = ${sntzedTypeId};`
    db.query(sql1 + sql2 + sql3, (error, results) => {
      db.query(`SELECT * from board where type_id = ${sntzedTypeId};`, (err, result) => {
        db.query(`SELECT * from boardtype where type_id = ${sntzedTypeId};`, (err, YN) => {
          var numPerPage = results[1][0].numPerPage;
          var offs = (pNum - 1) * numPerPage;
          var totalPages = Math.ceil(results[2][0].total / numPerPage);
          db.query(`select b.board_id as board_id, b.type_id as type_id, b.title as title, b.date as date, p.name as name 
                from board b inner join person p on b.loginid = p.loginid
                where b.type_id = ? and b.p_id = ? ORDER BY date desc, board_id desc LIMIT ? OFFSET ?`,
            [sntzedTypeId, 0, numPerPage, offs], (err, boards) => {
              var context = {
                menu: menubar,
                who: req.session.name,
                boardtypes: results[0],
                body: 'board.ejs',
                auth: req.session.class,
                logined: logined,
                typeid: sntzedTypeId,
                btname: results[1][0].title,
                list: result,
                board: boards,
                YN: YN,
                totalPages: totalPages,
                pNum: pNum,
              };
              console.log('durl', context)
              req.app.render('home', context, (err, html) => {
                if (err) {
                  console.error(err)
                }
                res.end(html);
              })
            })
        })
      })
    })
  },
  detail: (req, res) => {
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
    var boardId = req.params.boardId;
    var pNum = req.params.pNum;
    console.log()
    var sql1 = `SELECT * from boardtype;`
    var sql2 = `SELECT * from board WHERE board_id=${boardId}`
    db.query(sql1 + sql2, (error, results) => {
      db.query(`SELECT p.name as name 
      from board b inner join person p on b.loginid = p.loginid
      where b.board_id=${boardId}`, (err, result) => {
        var context = {
          menu: menubar,
          who: req.session.name,
          boardtypes: results[0],
          body: 'boardCRU.ejs',
          type: 'R',
          auth: req.session.class,
          logined: logined,
          loginid: req.session.loginid,
          board: results[1],
          writer: result[0].name,
          pNum: pNum
        };
        console.log(context)
        req.app.render('home', context, (err, html) => {
          if (err) {
            console.error(err)
          }
          res.end(html);
        })
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
    var typeId = req.params.typeId;
    var sql1 = `SELECT * from boardtype;`
    var sql2 = `SELECT * from board WHERE type_id=${typeId}`
    db.query(sql1 + sql2, (error, results) => {
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtypes: results[0],
        body: 'boardCRU.ejs',
        type: 'C',
        typeid: typeId,
        auth: req.session.class,
        logined: logined,
        loginid: req.session.loginid,
        board: results[1]
      };
      console.log(context)
      req.app.render('home', context, (err, html) => {
        if (err) {
          console.error(err)
        }
        res.end(html);
      })
    })
  },
  create_process: (req, res) => {
    var post = req.body;
    sanitizeType_id = sanitizeHtml(post.type_id)
    sanitizeLoginid = sanitizeHtml(post.loginid)
    sanitizeTitle = sanitizeHtml(post.title)
    sanitizeContent = sanitizeHtml(post.content)
    sanitizePassword = sanitizeHtml(post.password)
    var date = dateOfEightDigit()
    console.log(post)
    db.query('INSERT INTO board (type_id, p_id, loginid, password, title, date, content) VALUES(?,?,?,?,?,?,?)',
      [sanitizeType_id, 0, sanitizeLoginid, sanitizePassword, sanitizeTitle, date, sanitizeContent], (error, result) => {
        res.writeHead(302, { Location: `/board/view/${sanitizeType_id}/1` });
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
    var boardId = req.params.boardId
    var typeId = req.params.typeId
    var pNum = req.params.pNum
    db.query('SELECT * FROM boardtype', (err, results) => {
      db.query('SELECT * FROM board WHERE board_id=? AND type_id=?', [boardId, typeId], (err, board) => {
        db.query(`SELECT p.name as name 
                from board b inner join person p on b.loginid = p.loginid
                where b.board_id=${boardId}`, (err, result) => {
          var context = {
            menu: menubar,
            who: req.session.name,
            boardtypes: results,
            body: 'boardCRU.ejs',
            type: 'U',
            auth: req.session.class,
            logined: logined,
            board: board,
            writer: result[0].name,
            pNum: pNum
          };
          req.app.render('home', context, (err, html) => {
            res.end(html)
          })
        })
      })
    })
  },
  update_process: (req, res) => {
    var post = req.body;
    console.log(post)
    sanitizePNum = sanitizeHtml(post.pNum)
    sanitizeType_id = sanitizeHtml(post.type_id)
    sanitizeBoard_id = sanitizeHtml(post.board_id)
    sanitizeLoginid = sanitizeHtml(post.loginid)
    sanitizeTitle = sanitizeHtml(post.title)
    sanitizeContent = sanitizeHtml(post.content)
    var date = dateOfEightDigit()
    db.query('UPDATE board SET title=?, content=?, date=? WHERE board_id=?',
      [sanitizeTitle, sanitizeContent, date, sanitizeBoard_id], (error, result) => {

        res.writeHead(302, { Location: `/board/view/${sanitizeType_id}/${sanitizePNum}` });
        res.end();
      });
  },
  delete_process: (req, res) => {
    var boardId = req.params.boardId
    var typeId = req.params.typeId
    var pNum = req.params.pNum
    console.log(boardId, typeId, pNum)
    db.query('DELETE FROM board WHERE board_id=?', [boardId], (error, result) => {
      res.writeHead(302, { Location: `/board/view/${typeId}/${pNum}` });
      res.end();
    })
  }
}
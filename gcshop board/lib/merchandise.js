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
    db.query('SELECT count(*) as num FROM merchandise', (error, result) => {
      var num = result[0].num;
      var sql1 = `SELECT * from boardtype;`
      var sql2 = `SELECT * FROM merchandise;`
      db.query(sql1 + sql2, (error, results) => {
        var context = {
          menu: menubar,
          who: req.session.name,
          boardtypes: results[0],
          body: 'merchandise.ejs',
          logined: logined,
          page: vu,
          num: num,
          list: results[1],
          category: 'all'
        };
        console.log(results)
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
    var sql1 = `SELECT * from boardtype;`
    var sql2 = `SELECT * FROM code_tbl;`
    db.query(sql1 + sql2, (err, results) => {
      var category = ''
      var i = 0;
      while (i < results[1].length) {
        category += `<option value = "${results[1][i].sub_id}"> ${results[1][i].sub_name} `
        i += 1;
      }
      var tag = `<h2> 상품 입력 </h2>
      <form action="/merchandise/create_process" method="post" enctype="multipart/form-data" >
      <div class="mb-3">
        <label class="form-label" for="id">카테고리</label>
        <select name=category id="id">
          ${category}
        </select>
      <div class="mb-3">
        <label class="form-label" for="id">제품명</label>
        <input class="form-control" type="text" name="name" style="width:300px;"/>
      </div>
      <div class="mb-3">
        <label class="form-label" for= "id">가격</label>
        <input class="form-control" type="text" name="price" style="width:300px;"/> 
      </div>
      <div class="mb-3">
        <label class="form-label" for="id">재고</label>
        <input class="form-control" type="text" name="stock" style="width:300px;"/>
      </div>
      <div class="mb-3">
        <label class="form-label" for= "id">브랜드</label>
        <input class="form-control" type="text" name="brand" style="width:300px;"/> 
      </div >
      <div class="mb-3">
        <label class="form-label" for="id">공급자</label>
        <input class="form-control" type="text" name="supplier" style="width:300px;"/> 
      </div>
      <div class="mb-3">
        <label class="form-label" for="id">할인여부</label>
        <input class="form-control" type="text" name="sale_yn" style="width:300px;"/> 
      </div>
      <div class="mb-3">
        <label class="form-label" for= "id">할인가격</label>
        <input class="form-control" type="text" name="sale_price" style="width:300px;"/>
      </div>
      <div class="mb-3">
            <input class="upload-name" value="" name="image" placeholder="이미지파일">
            <input type="file" id="file" name="uploadFile" onchange="displayFileName()">
      </div>
      <button class="btn btn-outline-primary btn-sm" type="submit">입력</button>
      </form >`
      var context = {
        menu: menubar,
        who: req.session.name,
        boardtype: results[0],
        body: 'merchandiseCU.ejs',
        logined: logined,
        list: tag,
      };
      req.app.render('home', context, (err, html) => {
        res.end(html)
      })
    })
  },
  create_process: (req, res, file) => {
    var post = req.body;
    sanitizedCategory = sanitizeHtml(post.category);
    sanitizedName = sanitizeHtml(post.name);
    sanitizedPrice = sanitizeHtml(post.price);
    sanitizedStock = sanitizeHtml(post.stock);
    sanitizedBrand = sanitizeHtml(post.brand);
    sanitizedSupplier = sanitizeHtml(post.supplier);
    sanitizedSale_yn = sanitizeHtml(post.sale_yn);
    sanitizedSale_price = sanitizeHtml(post.sale_price);
    sanitizedImage = sanitizeHtml(file);
    db.query('INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price) VALUES(?,?,?,?,?,?,?,?,?)',
      [sanitizedCategory, sanitizedName, sanitizedPrice,
        sanitizedStock, sanitizedBrand, sanitizedSupplier,
        sanitizedImage, sanitizedSale_yn, sanitizedSale_price], (error, result) => {
          res.writeHead(302, { Location: `/merchandise/view/u` });
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
    var merId = req.params.merId;
    db.query(`SELECT * from boardtype`, (error, results) => {
      db.query('SELECT * FROM code_tbl', (err, code_tbl) => {
        db.query('SELECT * FROM merchandise WHERE mer_id=?', [merId], (error, result) => {
          console.log(code_tbl)
          var category = ''
          var i = 0;
          while (i < code_tbl.length) {
            category += `<option value= "${code_tbl[i].sub_id}"> ${code_tbl[i].sub_name}`
            i += 1;
          }
          var tag = `<h2>상품 수정</h2>
        <form action="/merchandise/update_process" method="post" enctype="multipart/form-data">
        <div class="mb-3">
          <input class="form-control" type="hidden" name="mer_id" value="${merId}">
        </div>
        <div class="mb-3">
          <label class="form-label" for="id">카테고리</label>
          <select name=category id="id" >
            ${category}
          </select>
        </div>
          <div class="mb-3">
            <label class="form-label" for="id">제품명</label>
            <input class="form-control" type="text" name="name" value='${result[0].name}' style="width:300px;"/>
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">가격</label>
            <input class="form-control" type="text" name="price" value='${result[0].price}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">재고</label>
            <input class="form-control" type="text" name="stock" value='${result[0].stock}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">브랜드</label>
            <input class="form-control" type="text" name="brand" value='${result[0].brand}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">공급자</label>
            <input class="form-control" type="text" name="supplier" value='${result[0].supplier}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">할인여부</label>
            <input class="form-control" type="text" name="sale_yn" value='${result[0].sale_yn}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="id">할인가격</label>
            <input class="form-control" type="text" name="sale_price" value='${result[0].sale_price}' style="width:300px;" />
          </div>
          <div class="mb-3">
            <input class="upload-name" value="${result[0].image}" name = "image" placeholder="이미지파일">
            <input type="file" id="file" name="uploadFile" onchange="displayFileName()">
      </div>
          <button class="btn btn-outline-primary btn-sm" type="submit">입력</button>
          </form>`
          var context = {
            menu: menubar,
            who: req.session.name,
            boardtypes: results,
            body: 'merchandiseCU.ejs',
            logined: logined,
            list: tag
          };
          req.app.render('home', context, (err, html) => {
            res.end(html);
          })
        })
      })
    })
  },
  update_process: (req, res, file) => {
    var post = req.body;
    sanitizeMer_id = sanitizeHtml(post.mer_id)
    sanitizedCategory = sanitizeHtml(post.category);
    sanitizedName = sanitizeHtml(post.name);
    sanitizedPrice = sanitizeHtml(post.price);
    sanitizedStock = sanitizeHtml(post.stock);
    sanitizedBrand = sanitizeHtml(post.brand);
    sanitizedSupplier = sanitizeHtml(post.supplier);
    sanitizedSale_yn = sanitizeHtml(post.sale_yn);
    sanitizedSale_price = sanitizeHtml(post.sale_price);
    sanitizedImage = sanitizeHtml(file)

    db.query('UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=? WHERE mer_id=?',
      [sanitizedCategory, sanitizedName, sanitizedPrice,
        sanitizedStock, sanitizedBrand, sanitizedSupplier,
        sanitizedImage, sanitizedSale_yn, sanitizedSale_price, sanitizeMer_id], (error, result) => {
          if (error) {
            console.error(error)
          }
          res.writeHead(302, { Location: `/merchandise/view/u` });
          res.end();
        });
  },
  delete_process: (req, res) => {
    var merId = req.params.merId;
    db.query('DELETE FROM merchandise WHERE mer_id=?', [merId], (error, result) => {
      res.writeHead(302, { Location: `/merchandise/view/u` });
      res.end();
    })
  },
}
// 202035107 권희진

var mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6336',
  database: 'webdb2023'
});
db.connect();
module.exports = db;
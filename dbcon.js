var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_schnaidm',
  password        : 'Queen666regina',
  database        : 'cs340_schnaidm'
});
module.exports.pool = pool;
let mysql = require('mysql')

let db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'dm_mg',
  port: '3306'
})

module.exports = db
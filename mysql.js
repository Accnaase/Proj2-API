const mysql = require('mysql2');

var pool = mysql.createPool({
    "user" : process.env.MYQl_USER,
    "password" : process.env.MYSQL_PASSWORD,
    "database" : process.env.MYSQL_DATABASE,
    "host" : process.env.MYSQL_HOST,
    "port" : process.env.MYSQL_PORT
});

exports.pool = pool;
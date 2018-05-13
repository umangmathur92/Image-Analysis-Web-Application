var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'NodeAuth'
});

connection.connect();

module.exports = connection;
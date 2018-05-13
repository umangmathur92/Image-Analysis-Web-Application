var mysql = require('mysql');

// var connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootPassword',
    database: 'NodeAuth'
});

connection.connect();

connection.query('select * from test', function (err, results, fields) {
    console.log('connected');
    if (err) throw err;
    console.log("result:" +JSON.stringify(results) );
});

module.exports = connection;
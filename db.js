var mysql = require('mysql');
var connection  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'njs1lisan',
    multipleStatements: true
});

module.exports = connection;

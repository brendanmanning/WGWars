async function get_database_connection() {
    var mysql = require('promise-mysql');
    var conn = await mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'war'
    });
    return conn;
}

module.exports = get_database_connection;
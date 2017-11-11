var get_database_connection = require('../db.js');

async function getPlayers(connection) {
    connection.query('SELECT * FROM players', function (error, results, fields) {
        return results;
        connection.end();
    });
}

async function getPlayer(id) {
    var database = await get_database_connection();
    var results = await database.query('select * from players WHERE id=? LIMIT 1', [id]);
    return results[0];
}

async function createPlayer(name, email, game, coordinates) {
    var database = await get_database_connection();
    var result = await database.query(
        'INSERT INTO players (name, email, game, coordinates) VALUES (?,?,?,?)', 
        [name, email, game, coordinates]
    );
    var lastInsertId = result['insertId'];
    return {
        id: result['insertId'],
        name: name,
        email: email,
        game: game,
        coordinates: coordinates
    };
}

module.exports = { getPlayers, getPlayer, createPlayer } ;
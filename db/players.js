var get_database_connection = require('../db.js');

async function getPlayers(connection) {
    connection.query('SELECT * FROM players', function (error, results, fields) {
        return results;
        connection.end();
    });
}

/**
 * Gets a player by their database id
 * @param {int} id 
 * @returns the player's database row as a JSON object
 */
async function getPlayer(id) {
    var database = await get_database_connection();
    var results = await database.query('select * from players WHERE id=? LIMIT 1', [id]);
    return results[0];
}

/**
 * 
 * @param {string} name This user's name (will be publically available)
 * @param {string} email The email of the user (will not be publically available)
 * @param {int} game The game id to attatch this new round to
 * @param {string} coordinates The coordinates of where this player lives. "latitude,longitude"
 * @returns The newly created player as a JSON object
 */
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
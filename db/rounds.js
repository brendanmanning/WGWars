var get_database_connection = require('../db.js');

/**
 * Returns all the created for a game 
 * @param game The internal/database id of the games to fetch rounds for
 */
async function getRounds(game) {
    var database = await get_database_connection();
    var results = await database.query("SELECT id, survivors, active FROM rounds WHERE game=?", [game]);
    return results;
}

/**
 * Creates a new round
 * @param {int} game The game id to attatch this to
 * @param {int} survivors The maximum number of players that should remain after this round
 * @returns The newly created round
 */
async function createRound(game, survivors) {
    var database = await get_database_connection();
    var result = await database.query(
        'INSERT INTO rounds (game, survivors) VALUES (?,?)',  
        [game, survivors]
    );
    var lastInsertId = result['insertId'];
    return {
        id: lastInsertId,
        survivors: survivors
    }
}

module.exports = { 
    createRound 
};
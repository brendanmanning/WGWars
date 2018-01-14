var get_database_connection = require('../db.js');
const getViewer = require('./Viewer.js');

/**
 * Is a user (by token) tje admin of a game
 * @param {int} game game id
 * @param {String} token FB auth token
 * @param {Object} admin FB auth SDK obj
 */
async function isAdmin(game, token, admin) {
    var database = await get_database_connection();

    // Get the user
    var user = await getViewer(token, admin);

    // Is this user a game admin?
    var results = await database.query("SELECT * FROM gameadmins WHERE game=? AND user=?", [game, user.id]);
    database.destroy();
    return (results.length == 1);
}

/**
 * Is the user allowed to view this game?
 * @param {int} game The game to view
 * @param {String} token FB auth token
 * @param {Object} admin FB auth SDK obj
 */
async function authViewGame(game, token, admin) {
    var player = await getViewer(token, admin);
    return player.game == game;
}

module.exports = {
    isAdmin,
    authViewGame
}
var get_database_connection = require('../db.js');
var getViewer = require('./Viewer.js');

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

module.exports = {
    isAdmin
}
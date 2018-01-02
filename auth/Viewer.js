var get_database_connection = require('../db.js');
var { getPlayer } = require('../db/players.js');

/**
 * Builds the context (namely containing the authenticated user)
 * @param {*} token The firebase token passed in with this request
 * @param {*} admin The firebase admin sdk object created in index.js
 * @returns {Object} The completed context object (for now, the only property is requester)
 */
async function getViewer(token, admin) {
    
    var database = await get_database_connection();
    var context = {};

    // Decompose the token to a uid
    var uid = await admin.auth().verifyIdToken(token);
    uid = uid['user_id'];

    console.log("UID: " + uid);

    // Select this player's id from the database
    var players = await database.query("SELECT * FROM players WHERE uid LIKE ?", [uid]);

    // Did we even get a player?
    if(players.length == 0) {
        return null;
    }

    var player = players[0];

    // Get this player's target assignment
    if(player.alive) {
        var assignment = await database.query("SELECT * FROM targets WHERE killer=?", [player.id]);
        player['assignment'] = assignment[0];
    } else {
        player['assignment'] = null;
    }

    return player;
}

module.exports = getViewer;
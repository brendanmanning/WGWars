var get_database_connection = require('./db.js');
var { getPlayer } = require('./db/players.js');

/**
 * Builds the context (namely containing the authenticated user)
 * @param {*} token The firebase token passed in with this request
 * @param {*} admin The firebase admin sdk object created in index.js
 * @returns {Object} The completed context object (for now, the only property is requester)
 */
async function buildcontext(token, admin) {
    var database = await get_database_connection();
    var context = {};

    console.log("TOKEN: " + token);
    console.log("REQUEST: " + JSON.stringify(token));

    // Decompose the token to a uid
    var uid = await admin.auth().verifyIdToken(token).uid;

    // Select this player's id from the database
    var players = await database.query("SELECT * FROM players WHERE uid LIKE ?", [uid]);
    var player = players[0];

    // Get this player's target assignment
    if(player.alive) {
        var assignment = await database.query("SELECT * FROM targets WHERE killer LIKE ?", [player.id]);
        player['assignment'] = assignment[0];
    } else {
        player['assignment'] = {
            id: -1,
            killer: -1,
            target: -1
        }
    }

    return {
        requester: player
    }
}

module.exports = buildcontext;
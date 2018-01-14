var get_database_connection = require('../db.js');
var mysql = require('mysql');

var { authPlayer, authPlayers, authUpdatePlayer } = require('../auth/player.js');

const { isAdmin } = require('../auth/game.js');
const { getGame } = require('./games.js');
const { getRound } = require('./rounds.js');
const { getAssignment } = require('./assignments.js');
/**
 * Selects multiple players from a given game.
 * Supports operations for pagation
 * @param {int} game An ID corresponding to a Game object
 * @param {boolean} alive If set, only players which are alive/dead will be shown
 * @param {boolean} paid If set, only players which have/have not paid will be shown
 * @param {int} count The maximum number of results to return
 * @param {int} offset The offset from which to select (useful for pagation)
 * @param {String} token FB AUth token
 * @param {Object} context GraphQL's context obj
 * @returns {object[]} An array of players from the database
 */
async function getPlayers(game, alive, paid, count, offset, token, context) {

    var database = await get_database_connection();

    var options = [game];
    var sql = "SELECT * FROM players WHERE game=?";

    if(alive != undefined) {
        sql += " AND alive=?";
        options.push(alive)
    }

    if(paid != undefined) {
        sql += " AND paid=?";
        options.push(paid);
    }

    if (count != undefined) {
        sql += " LIMIT ?";
        options.push(count);
    }

    if(offset != undefined) {
        sql += " OFFSET ?";
        options.push(offset);
    }

    var results = await database.query(sql, options);

    if(! (await authPlayers(results, token, context.admin))) {
        throw new Error("You do not have access to this resource (Players)");
        database.destroy();
        return null;
    }

    database.destroy();

    return results;
}

/**
 * Gets a player by their database id
 * @param {int} id 
 * @param {bool?} norecurse If this is true, assignment data will not be fetched for this object. Because assignments themselves contain player objects, this must eventually be set to true so as to avoid infinite recursion
 * @returns the player's database row as a JSON object
 */
async function getPlayer(id, token, context, norecurse) {

    // Get the player record
    var database = await get_database_connection();
    var player = await database.query('SELECT * FROM players WHERE id=?', [id]);
    player = player[0];

    // Resolve the game object
    player['game'] = await getGame(player['game'], token, context);

    // Is the player an admin of this game?
    player['isAdmin'] = await isAdmin(player['game'].id, token, context.admin);

    console.log("PLAYER OBJECT");
    console.log(JSON.stringify(player));

    // Does the viewer have permission to this result?
    var valid = await authPlayer(player, token, context.admin)
    if(!valid) {
        throw new Error("You do not have permission to view this resource (Player)");
        database.destroy();
        return null;
    }

    if(norecurse) {
        database.destroy();
        console.log("[81] Destroyed");
        return player;
    }
   
    // Get the lastest target assignment's 
    var assignmentid = await database.query("select id from targets WHERE killer=? ORDER BY id DESC LIMIT 1 ", [id]);
    
    // If the player is dead, they don't have a target
    if(player.alive == false || assignmentid.length == 0) {
        player.assignment = null;
    } else {
        assignmentid = assignmentid[0]['id'];
        console.log("Assignment id: "+ assignmentid);
        player.assignment = await getAssignment(assignmentid, token, context);
    }

    if(!player.alive) {
        
        // If the player is dead, get the assignment in which they were killed
        var killedAssignment = await database.query("SELECT * FROM targets WHERE target=? AND completed=1", [id]);
        
        if(killedAssignment.length > 0) {
            killedAssignment = killedAssignment[0];

            // Save the round in which they were killed
            player['eliminationRoundId'] = killedAssignment.round;

            // Get the player object who killed them
            player['killer'] = await getPlayer(killedAssignment.killer, token, context, true);
            player['killer'] = player['killer'][0];

        }
    }

    database.destroy();
    return player;
}

async function getPlayerByToken(token, context) {
    var database = await get_database_connection();

    // Decompose the token to a uid
    var uid = await context.admin.auth().verifyIdToken(token);
    uid = uid['user_id'];

    var player = await database.query("SELECT id FROM players WHERE uid LIKE ?", [uid]);

    // Make sure something actually was fetched (the user exists)
    if(player.length == 0) {
        throw new Error("Player does not exist.");
        database.destroy();
        return;
    }

    // Get the first (and only) player
    var playerid = player[0]['id'];

    console.log("id from token: " + playerid);

    var player = await getPlayer(playerid, token, context, false);
    return player;
}

/**
 * 
 * @param {string} name This user's name (will be publically available)
 * @param {string} email The email of the user (will not be publically available)
 * @param {string} phone The player's phone number
 * @param {string} image base 64 encoded profile icon
 * @param {string} uid The player's uid property from firebase
 * @param {int} game The game id to attatch this new round to
 * @param {string} coordinates The coordinates of where this player lives. "latitude,longitude"
 * @returns The newly created player as a JSON object
 */
async function createPlayer(name, email, phone, image, uid, game, coordinates) {

    name = name.toLowerCase();

    var database = await get_database_connection();
    var result = await database.query(
        'INSERT INTO players (name, email, phone, image, uid, pnid, game, coordinates, alive) VALUES (?,?,?,?,?,?,?,?,?)', 
        [name, email, phone, image, uid, null, game, coordinates, 1]
    );
    var lastInsertId = result['insertId'];

    database.destroy();

    return {
        id: result['insertId'],
        name: name,
        email: email,
        phone: phone,
        uid: uid,
        game: game,
        coordinates: coordinates,
        alive: 1,
        image: image
    };
}

/**
 * Updates information about a player
 * @param {int} id The ID of the player to update
 * @param {object} delta An object consisting of the new value for the following properties: name,email.alive,paid,pnid,coordinates. If a value is undefined, it will not be updated.
 * @returns {object} The updated player object
 */
async function updatePlayer(id, delta, token, context) {

    // Get the player first
    var playerobj = await getPlayerByToken(token, context);

    // Does the player not exist?
    if(playerobj == undefined) {
        playerobj = await createPlayer(delta.name, delta.email, delta.phone, delta.uid, undefined, delta.game, undefined);
    }

    // Does the player still not exist?
    if(playerobj == undefined) {
        database.destroy();
        return undefined;
    }
    
    // Authorize right away
    var valid = await authUpdatePlayer(playerobj, token, context.admin)
    if(!valid) {
        throw new Error("You do not have access to this mutation (UpdatePlayer)");
        database.destroy();
        return null;
    }

    var database = await get_database_connection();
    
    var sql = "UPDATE players SET ? WHERE id=?";
    var updates = {};
    var options = [];

    // Thanks to node-mysql's transformation of objects to MySQL-safe strings,
    // we can just take all the defined properties (those we want to update)
    // and make a new updates (delta) object out of that.
    for(var prop in delta) {
        if(delta[prop] != undefined) {
            updates[prop] = delta[prop];
        }
    }

    options = [updates, playerobj.id];

    await database.query(sql, options);

    // Reselct the player from the database and return
    sql = "SELECT * FROM players WHERE id=?";
    options = [playerobj.id];

    var results = await database.query(sql, options);

    database.destroy();

    return results[0];

}

/**
 * Updates the same information for all active platyers in a game
 * @param {int} game The id of the game we're in
 * @param {object} delta The changes to make to the players
 */
async function updateAllActivePlayers(game, delta) {
    var players = await getPlayers(game, true, true, undefined, undefined);

    for(var player in players) {
        await updatePlayer(player.id, delta);
    }

    return true;
}

module.exports = { 
    getPlayers,
    getPlayer, 
    getPlayerByToken,
    createPlayer, 
    updatePlayer,
    updateAllActivePlayers
};
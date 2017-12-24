var get_database_connection = require('../db.js');
var mysql = require('mysql');

const { getAssignment } = require('./assignments.js');
/**
 * Selects multiple players from a given game.
 * Supports operations for pagation
 * @param {int} game An ID corresponding to a Game object
 * @param {boolean} alive If set, only players which are alive/dead will be shown
 * @param {boolean} paid If set, only players which have/have not paid will be shown
 * @param {int} count The maximum number of results to return
 * @param {int} offset The offset from which to select (useful for pagation)
 * @returns {object[]} An array of players from the database
 */
async function getPlayers(game, alive, paid, count, offset) {
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
    return results;
}

/**
 * Gets a player by their database id
 * @param {int} id 
 * @returns the player's database row as a JSON object
 */
async function getPlayer(id) {

    // Get the player record
    var database = await get_database_connection();
    var player = await database.query('SELECT * FROM players WHERE id=?', [id]);
    player = player[0]
   
    // Get the lastest target assignment's i
    var assignmentid = await database.query("select id from targets WHERE killer=? ORDER BY id DESC LIMIT 1 ", [id]);
    assignmentid = assignmentid[0]['id']

    // If the player is dead, they don't have a target
    if(player.alive == false) {
        player.assignment = null;
    } else {
        player.assignment = getAssignment(assignmentid)
    }

    return player;
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
        'INSERT INTO players (name, email, game, coordinates, alive) VALUES (?,?,?,?,?)', 
        [name, email, game, coordinates, 1]
    );
    var lastInsertId = result['insertId'];
    return {
        id: result['insertId'],
        name: name,
        email: email,
        game: game,
        coordinates: coordinates,
        alive: 1
    };
}

/**
 * Updates information about a player
 * @param {int} id The ID of the player to update
 * @param {object} delta An object consisting of the new value for the following properties: name,email.alive,paid,pnid,coordinates. If a value is undefined, it will not be updated.
 * @returns {object} The updated player object
 */
async function updatePlayer(id, delta) {
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

    options = [updates, id];

    await database.query(sql, options);

    // Reselct the player from the database and return
    sql = "SELECT * FROM players WHERE id=?";
    options = [id];

    var results = await database.query(sql, options);
    return results[0];

}

/**
 * Updates the same information for all active platyers in a game
 * @param {int} game The id of the game we're in
 * @param {object} delta The changes to make to the players
 */
async function updateAllActivePlayers(game, delta) {
    var players = getPlayers(game, true, true, undefined, undefined);

    for(var player in players) {
        updatePlayer(player.id, delta);
    }

    return true;
}

module.exports = { 
    getPlayers, 
    getPlayer, 
    createPlayer, 
    updatePlayer,
    updateAllActivePlayers
} ;
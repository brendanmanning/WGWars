var get_database_connection = require('../db.js');
var { performance, magicValues } = require('../constants.js');

var { getPlayers, updatePlayer, updateAllActivePlayers } = require('./players.js');
var { assignTargets } = require('../algorithms/targets.js');
var { survivors } = require('../algorithms/survivors.js');
var { createAssignment } = require('./assignments.js');

var { notification } = require('../actions/notification.js');

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
 * Ends an old round
 * @param {int} round id of the round we're ending
 * @returns {int} The number of surviving players
 */
async function endRound(round) {
    var database = await get_database_connection();
    
    // Pick the survivors from this round
    var survivors = await survivors(round);

    // Mark everyone as dead
    await updateAllActivePlayers({
        alive: false
    });

    // Go back and re-mark all the survivors alive
    for(var survivor of survivors) {
        
        await updatePlayer(survivor.id, {
            alive: true
        })

        await notification(survivor.id, {
            title: "Congrats! You advanced!",
            message: survivor.reason
        });
    }
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

    // Create target assignments for this round
    var assignments = assignTargets(getPlayers(magicValues.game, true, true), performance.targetclusters);

    // Add the target assignments to the database
    for(var assignment of assignments) {
        createAssignment(lastInsertId, assignment);
    }

    return {
        id: lastInsertId,
        survivors: survivors
    }
}

/**
 * Activates and existing round and ends all prior ones
 * @param {int} round The id of the round to begin
 * @returns {string} A message indicating the status of the operation
 */
async function activateRound(round) {
    
}

module.exports = { 
    createRound 
};
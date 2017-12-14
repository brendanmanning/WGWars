var get_database_connection = require('../db.js');
var { performance, magicValues, messages } = require('../constants.js');

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

    console.log("[ debug ]: Ending round " + round);

    var database = await get_database_connection();
    
    // Pick the survivors from this round
    var _survivors = await survivors(round);

    // Mark everyone as dead
    await updateAllActivePlayers({
        alive: false
    });

    // Go back and re-mark all the survivors alive
    for(var survivor in _survivors) {
        
        await updatePlayer(survivor.id, {
            alive: true
        })

        await notification(survivor.id, {
            title: "Congrats! You advanced!",
            message: survivor.reason
        });
    }

    // Actually mark this rounds over
    await database.query(
        'UPDATE rounds SET active=0 WHERE id=?',
        [round]
    );
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
    var players = await getPlayers(magicValues.game, true, true)
    console.log(JSON.stringify(players));
    var assignments = assignTargets(await getPlayers(magicValues.game, true, true), performance.targetclusters);

    // Add the target assignments to the database
    for(var assignment in assignments) {
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
 * @returns {object} The round we just activated
 */
async function activateRound(round) {
    var rounds = await getRounds(magicValues.game);

    for(var r = 0; r < rounds.length; r++) {
        var thisround = rounds[r];
        if(thisround.active == 1) {
            await endRound(thisround.id);
        }
    }

    // TODO: Check if there are any pending disputes

    var database = await get_database_connection();
    var result = await database.query(
        'UPDATE rounds SET active=1 WHERE id=?',  
        [round]
    );

    // Return only the first (and only) result
    var r = await database.query(
        'SELECT * FROM rounds WHERE id=?',
        [round]
    );

    return r[0];
}

module.exports = { 
    createRound,
    endRound,
    activateRound
};
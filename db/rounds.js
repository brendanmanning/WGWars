var get_database_connection = require('../db.js');
var { performance, magicValues, messages } = require('../constants.js');

var { getPlayers, updatePlayer, updateAllActivePlayers } = require('./players.js');
var { assignTargets } = require('../algorithms/targets.js');
var { survivors } = require('../algorithms/survivors.js');
var { createAssignment } = require('./assignments.js');

var { notification } = require('../actions/notification.js');

var {
    authCreateRound,
    authActivateRound,
    authEndRound
} = require('../auth/round.js');

/**
 * Returns all the created for a game 
 * @param game The internal/database id of the games to fetch rounds for
 */
async function getRounds(game) {
    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM rounds WHERE game=?", [game]);
    database.destroy();
    return results;
}

/**
 * Ends an old round
 * @param {int} round id of the round we're ending
 * @returns {Object} The round that was ended
 */
async function endRound(round, context) {

    // Authorize right now
    if(!authEndRound(context.requester)) {
        throw new Error("You do not have access to this mutation (EndRound)");
        return null;
    }

    console.log("[ debug ]: Ending round " + round);
    
    // Pick the survivors from this round
    var database = await get_database_connection();
    var _survivors = await survivors(round);

    console.log("SURVIVORS of round " + round + ": " + JSON.stringify(_survivors));
    console.log(_survivors.length + " players survived!!");

    // Notify all survivors that they're good
    for(var survivor in _survivors) {

        await notification(survivor.id, {
            title: "Congrats! You advanced!",
            message: survivor.reason
        });
    }

    // Actually mark this rounds over
    await database.query(
        'UPDATE rounds SET active=0, survivors=? WHERE id=?',
        [_survivors.length, round]
    );

    // Get the ended round
    var round = await database.query('SELECT * FROM rounds WHERE id=?', [round]);

    database.destroy();

    return round[0];
}

/**
 * Creates a new round
 * @param {int} game The game id to attatch this to
 * @param {int} survivors The maximum number of players that should remain after this round
 * @returns The newly created round
 */
async function createRound(game, context) {

    // Authorize right now
    if(!authCreateRound(context.requester)) {
        throw new Error("You do not have access to this mutation (CreateRound)");
        return null;
    }

    var database = await get_database_connection();
    var result = await database.query(
        'INSERT INTO rounds (game, survivors) VALUES (?,-1)',  
        [game]
    );
    var lastInsertId = result['insertId'];

    database.destroy();

    return {
        id: lastInsertId,
        survivors: -1
    }
}

/**
 * Activates and existing round and ends all prior ones
 * @param {int} round The id of the round to begin
 * @returns {object} The round we just activated
 */
async function activateRound(round, context) {

    // Authorize right now
    if(!authActivateRound(context.requester)) {
        throw new Error("You do not have access to this mutation (ActivateRound)");
        return null;
    }

    var rounds = await getRounds(magicValues.game);

    /*for(var r = 0; r < rounds.length; r++) {
        var thisround = rounds[r];
        console.log(JSON.stringify(thisround));
        if(thisround.active == 1) {
            await endRound(thisround.id);
        }
    }*/

    // Set the database record to active=1
    var database = await get_database_connection();
    var result = await database.query(
        'UPDATE rounds SET active=1 WHERE id=?',  
        [round]
    );

    // Create target assignments for this round
    var players = await getPlayers(magicValues.game, true, true);
    console.log("[ debug ]: Players still alive: " + JSON.stringify(players));
    var assignments = assignTargets(await getPlayers(magicValues.game, true, true), performance.targetclusters);
    console.log("[ debug ]: Assignments = " + JSON.stringify(assignments));
    // Add the target assignments to the database
    for(var assignment of assignments) {
        console.log("\t[ debug ]: Creating assignment: " + JSON.stringify(assignment));
        createAssignment(round, assignment);
    }

    // Return only the first (and only) result
    var r = await database.query(
        'SELECT * FROM rounds WHERE id=?',
        [round]
    );

    database.destroy();
    return r[0];
}

module.exports = { 
    createRound,
    endRound,
    activateRound
};
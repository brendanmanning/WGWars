var get_database_connection = require('../db.js');
var { performance, magicValues, messages } = require('../constants.js');

const { getPlayers, updatePlayer, updateAllActivePlayers } = require('./players.js');
const { getGame } = require('./games.js');
var { assignTargets } = require('../algorithms/targets.js');
var { survivors } = require('../algorithms/survivors.js');
var { createAssignment } = require('./assignments.js');

var { notification } = require('../actions/notification.js');

var {
    authCreateRound,
    authActivateRound,
    authEndRound
} = require('../auth/round.js');

var {
    isAdmin
} = require('../auth/game.js');

/**
 * Returns the id of a game, given the round id
 * @param {int} roundid The round's id
 * @returns {int} The id of the game this round belongs to
 */
async function getGameFromRound(roundid) {
    var database = await get_database_connection();
    var results = await database.query("SELECT game FROM rounds WHERE id=?", [roundid]);
    database.destroy();
    return results[0]['game'];
}

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
async function endRound(round, token, context) {

    // Authorize right now
    /*var valid = await authEndRound(round, token, context.admin)
    if(!valid) {
        throw new Error("You do not have access to this mutation (EndRound)");
        database.destroy();
        return null;
    }*/

    console.log("[ debug ]: Ending round " + round);
    
    // Pick the survivors from this round
    var database = await get_database_connection();
    var _survivors = await survivors(round, token, context);

    console.log("SURVIVORS of round " + round + ": " + JSON.stringify(_survivors));
    console.log(_survivors.length + " players survived!!");

    // Notify all survivors that they're good

        await notification(_survivors, 
            'default',
            "Congrats! You advanced to the next round!",
            { destination: 'feed' }
        );
    

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
async function createRound(game, token, context) {

    // Authorize right now
    /*var valid = await authCreateRound(game, token, context.admin);
    if(!valid) {
        throw new Error("You do not have access to this mutation (CreateRound)");
        database.destroy();
        return null;
    }*/

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
async function activateRound(round, token, context) {

    const { getPlayers, updatePlayer, updateAllActivePlayers } = require('./players.js');

    // Authorize right now
    /*var valid = await authActivateRound(round, token, context.admin);
    if(!valid) {
        throw new Error("You do not have access to this mutation (ActivateRound)");
        
        return null;
    }*/

     // Get the round object f
     var database = await get_database_connection();
     var result = await database.query(
         'UPDATE rounds SET active=1 WHERE id=?',  
         [round]
     );

    // Get the game this round is for
    var game = await getGameFromRound(round);
    console.log("Game from round: " + JSON.stringify(game));
   //var rounds = await getRounds(game.id);

    // Set the database record to active=1
    var result = await database.query(
        'UPDATE rounds SET active=1 WHERE id=?',  
        [round]
    );

    // Create target assignments for this round
    var assignments = assignTargets(await getPlayers(game.id, true, true, undefined, undefined,token, context), performance.targetclusters);
    console.log("[ debug ]: Assignments = " + JSON.stringify(assignments));
    
    // Add the target assignments to the database
    for(var assignment of assignments) {
        console.log("\t[ debug ]: Creating assignment: " + JSON.stringify(assignment));
        createAssignment(round, assignment);
    }

    // Update the game with the currentRound
    var res = await database.query("UPDATE games SET currentRound=? WHERE id=?", [round, game.id])

    // Return only the first (and only) result
    var r = await database.query(
        'SELECT * FROM rounds WHERE id=?',
        [round]
    );

    database.destroy();
    return r[0];
}

async function newRound(game, token, context) {

}

async function fullyDoNewRound(game, token, context) {
    const { getGame } = require('./games.js');
    // Auth the request
    console.log(JSON.stringify(context));
    var admin = await isAdmin(game, token, context.admin);
    if(!admin) {
        throw new Error("You must be admin to run that query!");
        return undefined;
    } 

    // Create new round, end the old one, activate the new one
    
    var thisgame = await getGame(game, token, context);

    console.log("Current Round: ")
    var round = await createRound(game, token, context);
    console.log("Created Round: " + JSON.stringify(round));
    var endedround = await endRound(thisgame.currentRound, token, context);
    console.log("Ended Round: " + JSON.stringify(endedround));
    var newround = await activateRound(round.id, token, context);
    console.log("New Round: " + JSON.stringify(newround));
    return newround;
}

module.exports = { 
    fullyDoNewRound,
    getGameFromRound,
    createRound,
    endRound,
    activateRound
};
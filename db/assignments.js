var get_database_connection = require('../db.js');

var { 
    authAssignment, 
    authAssignments,
    authCompleteAssignment 
} = require('../auth/assignment.js');

var {
    getGame
} = require('./games.js');

var {
    getPlayers
} = require('./players.js');

var {
    notifyGameAdmins
} = require('../actions/notification.js');

/**
 * Gets an assignment with a given id
 * @param {int} id The id of the assignment to get
 * @returns {Object} The assignment database object, with player objects inserted
 */
async function getAssignment(id, token, context) {
    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM targets WHERE id=?", [id]);
    var result = results[0];

    // Does this viewer have permission to this resource?
    var valid = await authAssignment(result, token, context.admin);
    if(!valid) {
        database.destroy();
        throw new Error("You do not have access to this resource (Assignment)");
        return null;
    }

    var { getPlayer } = require('./players.js');

    result.killer = await getPlayer(result.killer, token, context, true);
    result.target = await getPlayer(result.target, token, context, true);

    database.destroy();

    return results[0];
}

/**
 * Returns all the target assignments for a given round
 * @param {int} round The round ID to find results for
 * @return {[Object]} A JSON repreentation of the MySQL result 
 */
async function getAssignments(round) {

    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM targets WHERE round=?", [round]);
    
    database.destroy();
    
    return results;
}

/**
 * Inserts a target assignment record
 * @param {int} round The round ID for these target assignments
 * @param {Object} assignment The target assignment object
 * @returns {Object} The newly created target record as a JSON object
 */
async function createAssignment(round, assignment) {
    var database = await get_database_connection();
    var results = await database.query("INSERT INTO targets (round, killer, target) VALUES (?,?,?)", 
        [round, assignment.killer.id, assignment.target.id]
    );

    database.destroy();

    return results;
}

/**
 * Completes an assignment (Kills a player)
 * @param {int} assignment The assignment to complete
 * @param {String} video The video url for this completion
 * @param {Object} context The context object passed from express
 * @return {[Object]} A JSON repreentation of the assignment completed
 */
async function completeAssignment(assignment, video, context) {

    // Validate ahead of time
    var valid = await authCompleteAssignment(assignment, token, context.admin);
    if(!valid) {
        throw new Error("You do not have access to this mutation (CompleteAssignment)");
        return null;
    }

    var database = await get_database_connection();

    // Mark the assignment completed in the database
    var results = await database.query("UPDATE targets SET completed=1 WHERE id=?", [assignment]);
    var assignment = await database.query("SELECT * FROM targets WHERE id=?", [assignment]);
    assignment = assignment[0];

    // Save the video evidence
    await database.query("INSERT INTO completions (assignmentid, video) VALUES (?,?)", [assignment, decodeURIComponent(video)]);

    // Kill the player
    await database.query("UPDATE players SET alive=0 WHERE id=?", [assignment[0]["target"]]);

    // Check if this was the winning kill
    var players = await getPlayers(assignment.game, true, true, undefined, undefined, token, context);
    if(players.length == 1) {
        await notifyGameAdmins("The game may have finished. Verify assignment id = " + assignment.id, token, context);
    }

    database.destroy();

    // Return the completed assignment object
    return assignment[0];
}

module.exports = {
    getAssignment,
    getAssignments,
    createAssignment,
    completeAssignment
}

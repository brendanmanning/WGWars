var get_database_connection = require('../db.js');
/**
 * Gets an assignment with a given id
 * @param {int} id The id of the assignment to get
 * @returns {Object} The assignment database object, with player objects inserted
 */
async function getAssignment(id, context) {
    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM targets WHERE id=?", [id]);
    var result = results[0];

    var { getPlayer } = require('./players.js');

    result.killer = await getPlayer(result.killer, context, true);
    result.target = await getPlayer(result.target, context, true);

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
 * @return {[Object]} A JSON repreentation of the assignment completed
 */
async function completeAssignment(assignment) {
    var database = await get_database_connection();

    // Mark the assignment completed in the database
    var results = await database.query("UPDATE targets SET completed=1 WHERE id=?", [assignment]);
    var assignment = await database.query("SELECT * FROM targets WHERE id=?", [assignment]);

    // Kill the player
    await database.query("UPDATE players SET alive=0 WHERE id=?", [assignment[0]["target"]]);

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

var get_database_connection = require('../db.js');

/**
 * Returns all the target assignments for a given round
 * @param {int} round The round ID to find results for
 * @return {[Object]} A JSON repreentation of the MySQL result 
 */
async function getAssignments(round) {
    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM targets WHERE round=?", [round]);
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
    return results;
}

module.exports = {
    getAssignments
}

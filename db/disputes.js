var get_database_connection = require('../db.js');
var { getAssignment } = require('./assignments.js')

async function createDispute(complainer, assignment, comment) {
    var database = await get_database_connection();

    // Get the killer and target from the assignment
    assignment = await getAssignment(assignment);

    var result = await database.query("INSERT INTO disputes (complainer, round, killer, target, comment) VALUES (?,?,?,?,?)", [complainer, assignment.round, assignment.killer.id, assignment.target.id,comment]);
    var lastInsertId = result['insertId'];
    
    var result = {
        id: lastInsertId,
        round: assignment.round,
        complainer: complainer,
        killer: assignment.killer.id,
        target: assignment.target.id,
        comment: comment,
        resolved: false
    }

    database.destroy();

    return result;
}

async function getDispute(id, context) {
    
    // Get the player record
    var database = await get_database_connection();
    var dispute = await database.query('SELECT * FROM disputes WHERE id=?', [id]);

    database.destroy();

    return dispute[0];
}

async function getDisputes(round) {
    // Get the player record
    var database = await get_database_connection();
    var disputes = await database.query('SELECT * FROM disputes WHERE round=?', [round]);

    database.destroy();

    return disputes;
}

module.exports = {
    createDispute,
    getDispute,
    getDisputes
}
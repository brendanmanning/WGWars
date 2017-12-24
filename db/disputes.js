var get_database_connection = require('../db.js');

async function getDispute(id) {
    // Get the player record
    var database = await get_database_connection();
    var dispute = await database.query('SELECT * FROM disputes WHERE id=?', [id]);
    return dispute[0];
}

async function getDisputes(round) {
    // Get the player record
    var database = await get_database_connection();
    var disputes = await database.query('SELECT * FROM disputes WHERE round=?', [round]);
    return disputes;
}

module.exports = {
    getDispute,
    getDisputes
}
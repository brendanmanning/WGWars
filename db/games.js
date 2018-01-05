var get_database_connection = require('../db.js');
const { getRound } = require('./rounds.js');

async function getGame(id, token, context) {
    var database = await get_database_connection();

    // Get the database record
    var dbrecord = await database.query("SELECT * FROM games WHERE id=?", [id]);
    dbrecord = dbrecord[0];

    return dbrecord;
}


module.exports = {
    getGame
}
var get_database_connection = require('../db.js');

async function isAdmin(user, game) {
    var database = await get_database_connection();
    var results = await database.query("SELECT * FROM gameadmins WHERE game=? AND user=?", [game, user.id]);
    console.log("[6] Destroyed");
    database.destroy();
    return (results.length == 1);
}

module.exports = {
    isAdmin
}
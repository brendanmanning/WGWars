var get_database_connection = require('../db.js');
const { getRound } = require('./rounds.js');
const { authViewGame } = require('../auth/game.js');
const getViewer = require('../auth/Viewer.js');

async function getGame(id, token, context) {
    var database = await get_database_connection();

    // If a game ID was not specified, get the game the user is in
    if(id == undefined) {
        var viewer = await getViewer(token, context.admin);
        id = viewer.game;

        console.log("Viewer ==> " + console.log(viewer));
        console.log("Game id ==> " + id);
    }

    var authed = await authViewGame(id, token, context.admin);
    if(!authed) {
        throw new Error("You do not have permission to view this record (Game)");
        database.destroy();
        return undefined;
    }

    // Get the database record
    var dbrecord = await database.query("SELECT * FROM games WHERE id=?", [id]);
    dbrecord = dbrecord[0];

    database.destroy();

    return dbrecord;
}


module.exports = {
    getGame
}
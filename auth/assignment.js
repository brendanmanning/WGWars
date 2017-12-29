var { isAdmin } = require('./game.js');
var { getGame } = require('../db/rounds.js');

async function authAssignment(object, viewer) {

    console.log("Object: " + JSON.stringify(object));
    console.log("Viewer: " + JSON.stringify(viewer));

    // Only the owner should be able to see their assignment
    var game = await getGame(object.round);
    console.log("Game: " + game);
    var admin = await isAdmin(viewer, game);
    if(viewer.id == object.killer || admin) {
        return true;
    }

    return false;
}

async function authAssignments(game, viewer) {
    return await isAdmin(viewer, game)
}

async function authCompleteAssignment(assignmentid, viewer) {
    return viewer.assignment.id == assignmentid;
}

module.exports = {
    authAssignment,
    authCompleteAssignment
}
var { isAdmin } = require('./game.js');
var { getGame } = require('../db/rounds.js');
var getViewer = require('./Viewer.js');
/**
 * Determines if a player can see an assignment
 * @param {Object} object The assignment object
 * @param {String} token Firebase authentication token for the viewer
 * @param {Object} admin Object for firebase admin sdk
 */
async function authAssignment(object, token, admin) {

    console.log("Object: " + JSON.stringify(object));
    console.log("Viewer: " + JSON.stringify(viewer));

    // Only the owner should be able to see their assignment
    var game = await getGame(object.round);
    console.log("Game: " + game);
    var admin = await isAdmin(game, token, game);
    if(viewer.id == object.killer || admin) {
        return true;
    }

    return false;
}

/**
 * Determines if a player can see  assignments
 * @param {int} game Game id
 * @param {String} token Firebase authentication token for the viewer
 * @param {Object} admin Object for firebase admin sdk
 */
async function authAssignments(game, token, admin) {
    return await isAdmin(game, token, admin)
}

/**
 * Can a user finish an assignment object?
 * @param {int} assignmentid ID of the assignment object
 * @param {String} token FB Auth token
 */
async function authCompleteAssignment(assignmentid, token, admin) {
    var viewer = await getViewer(token, admin);
    console.log("CHECK auth/assignment.js LINE 41!!!!");
    return viewer.assignment.id == assignmentid;
}

module.exports = {
    authAssignment,
    authCompleteAssignment
}
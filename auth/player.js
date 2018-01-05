var { isAdmin } = require('./game.js');
var getViewer = require('./Viewer.js');

/**
 * Is a player allowed to view another player's object?
 * @param {Object} player The player object being viewed
 * @param {String} token FB Auth token
 * @param {Object} admin FB Admin SDK object
 */
async function authPlayer(player, token, admin) {

    return true;

    // Get the viewer
    var viewer = await getViewer(token, admin);

    console.log("Viewer: " + JSON.stringify(viewer));

    if(viewer == undefined) {
        return false;
    }

    console.log("VIEWER");
    console.log(JSON.stringify(viewer));

    // The player can see all their own fields
    if(viewer.id == player.id) {
        return true;
    }

    // The player who is targeting this can see it too
    if(viewer.assignment != null) {
        if(viewer.assignment.target == player.id) {
            return true;
        }
    }

    console.log("authPlayer player == " + JSON.stringify(player));

    var valid = (await isAdmin(player.game, token, admin));
    return valid;
}

/**
 * Authenticates viewing an array of player
 * @param {Object[]} objects The players to verify if we can see
 * @param {String} token FB Auth token
 * @param {Object} admin FB Auth SDK Obj 
 */
async function authPlayers(objects, token, admin) {
    
    // Only the admin can list all users
    for(var i = 0; i < objects.length; i++) {
        var auth = await authPlayer(objects[i], token, admin);
        if(!auth) {
            return false;
        }
    }

    return true;
}

/**
 * Can a player make edits to this player??
 * @param {String} token FB Auth token
 * @param {Object} admin FB Auth SDK obj
 */
async function authUpdatePlayer(object, token, admin) {

    // Get the viewer
    var viewer = await getViewer(token, admin)

    // Only the player (or an admin) can update a user
    if(object.id == viewer.id) {
        return true;
    }

    var valid = await isAdmin(object.game, token, admin);
    return valid;
}

module.exports = {
    authPlayer,
    authPlayers,
    authUpdatePlayer
}
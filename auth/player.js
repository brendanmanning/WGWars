var { isAdmin } = require('./game.js');

async function authPlayer(object, viewer) {

    // The player can see all their own fields
    if(viewer.id == object.id) {
        return true;
    }

    // The player who is targeting this can see it too
    if(viewer.assignment.target == object.id) {
        return true;
    }

    console.log(JSON.stringify(object));

    var valid = (await isAdmin(viewer, object.game));
    return valid;
}

async function authPlayers(objects, viewer) {
    
    // Only the admin can list all users
    for(var i = 0; i < objects.length; i++) {
        var auth = await authPlayer(objects[i], viewer);
        if(!auth) {
            return false;
        }
    }

    return true;
}

async function authUpdatePlayer(object, viewer) {

    // Only the player (or an admin) can update a user
    if(object.id == viewer.id) {
        return true;
    }

    var valid = await isAdmin(viewer, object.game);
    return valid;
}

module.exports = {
    authPlayer,
    authPlayers,
    authUpdatePlayer
}
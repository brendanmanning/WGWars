function authPlayer(object, viewer) {

    // The player can see all their own fields
    if(viewer.id == object.id) {
        return true;
    }

    // The player who is targeting this can see it too
    if(viewer.assignment.target == object.id) {
        return true;
    }

    // Everyone else can see nothing
    return false;
}

function authPlayers(objects, viewer) {
    
    // Only the admin can list all users
    if(viewer.isAdmin) {
        return true;
    }

    return false;
}

function authUpdatePlayer(id, viewer) {

    // Only the player (or an admin) can update a user
    if(id == viewer.id || viewer.isAdmin) {
        return true;
    }

    return false;
}

module.exports = {
    authPlayer,
    authPlayers,
    authUpdatePlayer
}
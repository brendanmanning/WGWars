function authCreateRound(viewer) {
    return viewer.isAdmin;
}

function authActivateRound(viewer) {
    return viewer.isAdmin;
}

function authEndRound(viewer) {
    return viewer.isAdmin;
}

module.exports = {
    authCreateRound,
    authActivateRound,
    authEndRound
};
var { isAdmin } = require('./game.js');
var { getGame } = require('../db/rounds');

async function authCreateRound(gameid, viewer) {
    var valid = await isAdmin(viewer, gameid);
    return valid;
}

async function authActivateRound(round, viewer) {
    var gameid = await getGame(round);
    var valid = await isAdmin(viewer, gameid);
    return valid;
}

async function authEndRound(round, viewer) {
    var gameid = await getGame(round);
    var valid = await isAdmin(viewer, gameid);
    return valid;
}

module.exports = {
    authCreateRound,
    authActivateRound,
    authEndRound
};
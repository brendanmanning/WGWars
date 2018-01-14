var { isAdmin } = require('./game.js');

/**
 * Can we create a new round?
 * @param {int} gameid ID of the game we're creating a round in
 * @param {String} token FB auth token
 * @param {Object} admin FB auth SDK obj
 */
async function authCreateRound(gameid, token, admin) {
    var valid = await isAdmin(gameid, token, admin);
    return valid;
}

/**
 * Can we activate a new round?
 * @param {int} round ID of the round we're activating
 * @param {String} token FB auth token
 * @param {Object} admin FB auth SDK obj
 */
async function authActivateRound(round, token, admin) {
    const { getGameFromRound } = require('../db/rounds.js');
    var gameid = await getGameFromRound(round);
    var valid = await isAdmin(gameid, token, admin);
    return valid;
}

/**
 * Can we end an old round?
 * @param {int} round ID of the round we're activating
 * @param {String} token FB auth token
 * @param {Object} admin FB auth SDK obj
 */
async function authEndRound(round, token, admin) {
    const { getGameFromRound } = require('../db/rounds.js');
    var gameid = await getGameFromRound(round);
    var valid = await isAdmin(gameid, token, admin);
    return valid;
}

module.exports = {
    authCreateRound,
    authActivateRound,
    authEndRound
};
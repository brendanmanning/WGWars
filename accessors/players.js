"use strict";
exports.__esModule = true;
/**
 * Allows us to get a user by their ID number from the database
 */
function getPlayer(id) {
    if (id == 'b') {
        return {
            id: 'b',
            name: 'Brendan Manning',
            verified: 1
        };
    }
    else if (id == 'j') {
        return {
            id: 'j',
            name: 'Joe Manning',
            verified: 0
        };
    }
}
exports.getPlayer = getPlayer;

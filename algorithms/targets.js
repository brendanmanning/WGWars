const midpoint = require('midpoint.js');

/**
 * Randomly assigns each player a target to kill, with consideration given to distance between targets (to prevent unnecessay driving)
 * @param {[Player]} players An array of player objects (JSON representations of their MySQL object)
 * @param {int} randomness A positive integer 1-infinity. Higher numbers allow more targets to be further from each other (and thus more random). A value of 1 assigns every player to the closest available target to them
 * @returns {{TargetAssignment}} An array of objects. Each object has the following properties: killer, target.
 */
function assignTargets(players, randomness) {

    if(randomness < 1) {
        return [];
    }

    var targetassignments = [];

    /* Calculate the midpoint of all the players' homes */
    var coordinates = players.map(p => p.coordinates);
    var midpoint = midpoint(coordinates);
    coordinates = null; // Free up some memory

    /* Sort the players by their distance from the center */
    players.sort(function(p1,p2) {
        return distance(p2.coordinates, midpoint) - distance(p1.coordinates, midpoint);
    });

    var killer = players[0];
    var target = null;

    while(targetassignments.length < players.length * 2) {

        // Sort the players by their distance to this player
        // Naturally, index 0 will be the player himself
        players.sort(function(p1, p2) {
            return distance(p2.coordinates, killer.coordinates) - distance(p2.coordinates, midpoint);
        });


    }
}
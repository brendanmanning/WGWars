const { midpoint, distance } = require('./math.js');

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
    var center = midpoint(coordinates);
    coordinates = null; // Free up some memory

    /* Sort the players by their distance from the center */
    players.sort(function(p1,p2) {
        return distance(p2.coordinates, center) - distance(p1.coordinates, center);
    });

    var initialkiller = players[0];
    var killer = players[0];
    var target = null;

    while(targetassignments.length < players.length * 2) {

        // Sort the players by their distance to this player
        // Naturally, index 0 will be the player himself
        players.sort(function(p1, p2) {
            return distance(p1.coordinates, killer.coordinates) - distance(p2.coordinates, killer.coordinates);
        });

        // Pick the player that is a random indexes away
        var index = Math.floor(Math.random() * randomness) + 1;
        target = players[index];

        // Add a target object
        targetassignments.push({
            killer: killer,
            target: target
        });

        // Make this player kill someone now
        killer = target;

        // Remove the target from the players availabvle to be killed
        players.splice(index, 1);
    }

    // Loop back around to the beginning
    targetassignments.push({
        killer: killer,
        target: initialkiller
    })

    return targetassignments;

   // console.log(JSON.stringify(targetassignments));
}

module.exports = assignTargets;
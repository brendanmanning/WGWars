const { midpoint, distance } = require('./math.js');

/**
 * Randomly assigns each player a target to kill, with consideration given to distance between targets (to prevent unnecessay driving)
 * @param {[Player]} players An array of player objects (JSON representations of their MySQL object)
 * @param {int} randomness A positive integer 1-infinity. Higher numbers allow more targets to be further from each other (and thus more random). A value of 1 assigns every player to the closest available target to them
 * @returns {{TargetAssignment}} An array of objects. Each object has the following properties: killer, target.
 */
function assignTargets(players, k) {

    var centroids = [];
    var centers = [];

    // Pick first cluster center
    centers.push(players[0].coordinates);
    centroids.push([]);

    // Pick k-1 cluster centers
    for(var j = 1; j < k; j++) {
        centroids.push([]); // Add the centroid array for this k (used later on)
        var leadingdistance = 0;
        var leadingpoint = null;
        for(var l = 1; l < players.length; l++) {
            var thisdistance = 0;
            for(var c = 0; c < centers.length; c++) {
                thisdistance += distance(centers[c], players[l].coordinates);
            }
            if(thisdistance > leadingdistance) {
                leadingdistance = thisdistance;
                leadingpoint = players[l].coordinates;
            }
        }
        centers.push(leadingpoint);
    }

    // Place the points near the closes centroid
    for(var p = 0; p < players.length; p++) {

        // All of this finds the nearest centroid
        var centroid = -1;
        var smallestdistance = 0;
        var firstrun = true;
        for(var c = 0; c < centers.length; c++) {
            if(firstrun) {
                smallestdistance = distance(players[p].coordinates, centers[c]);
                centroid = c;
                firstrun = false;
            } else {
                var dist = distance(players[p].coordinates, centers[c]);
                if(dist < smallestdistance) {
                    smallestdistance = dist;
                    centroid = c;
                }
            }
        }

        // Add it to the centroid
        centroids[centroid].push(players[p].coordinates);

        // Recalculate the centroid's center
        centers[centroid] = midpoint(centroids[centroid]);
    }

    // Check if any centroids have only one element
    var c = 0;
    while (c < centroids.length) {
        if(centroids[c].length == 1) {

            // Find the nearest centroid
            var shortest = 0;
            var centroid = -1;
            var first = true;
            for(var cc = 0; cc < centroids.length; cc++) {
                
                if(cc == c) {
                    continue;
                }

                var dist = distance(centers[cc], centroids[c][0]);
                if(first || dist < shortest) {
                    shortest = dist;
                    centroid = cc;
                    first = false;
                }
            }

            // Add this to the closest centroid
            centroids[centroid].push(centroids[c][0]);

            // Remove the center for this centroid
            centers.splice(c,1);
            centroids.splice(c,1);
        }

        c++;
    }

    console.log(JSON.stringify(centroids));

    // TODO: - Reassign to closes centroid

    // TODO: - Group killers/targets
    var targets = [];
    for(var c = 0; c < centroids.length; c++) {
        
    }
}

module.exports = assignTargets;
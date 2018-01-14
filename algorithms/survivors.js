var { getAssignments } = require('../db/assignments.js');
var { getPlayers, updatePlayer } = require('../db/players.js');
var { shuffle } = require('./array.js');

var { magicValues } = require('../constants.js');
var get_database_connection = require('../db.js');
/**
 * Chooses the survivors of a round like so:
 *   > Those who killed their target and weren't killed : Automatically advances
 *   > Those who both killed/were killed or who neither killed/were killed : Drawing for remainder of seats
 *   > If any left over, choose randomly from the rest
 * This will be defined by the concept of prestige
 *   > Start at zero.
 *   > Get killed -> -1
 *   > Kill -> +1
 * @param {int} round The round that is ending
 * @returns {[Object]} An array of objects that contain surviving players AND an explanation (String) of why they survived.
 */
/*async function survivors(round) {
    
    // Define variables
    var countsurvivors = 5;
    var spotsleft = countsurvivors;

    var players = {};
    var medians = [];
    var lows = [];
    var bottom = [];
    
    var survivors = [];

    // Keep track of how many people survive for what reasons
    // This can be used for automated testing purposes
    var statistics = {
        top: 0,
        both: 0,
        neither: 0,
        bottom: 0
    };

    // Get all living players from this round in array format & transform into object format
    var dbplayers = await getPlayers(magicValues.game, true, true);
    for(var p of dbplayers) {
        players[parseInt(p.id)] = p;
    }

    // Get all the assignments for this round
    var assignments = await getAssignments(round);
    console.log("PLAYERS == " + JSON.stringify(players));
console.log("Assignments: " + JSON.stringify(assignments));
    // Keep track of the statistics for every player as we loop through the data
    for(var assignment of assignments) {
        console.log("\tAssignment: " + JSON.stringify(assignment));
        players[assignment.killer]["killed"] = assignment.completed;
        players[assignment.killer]["prestige"] += (assignment.completed) ? 1 : 0;
        players[assignment.target]["gotkilled"] = assignment.completed;
        players[assignment.target]["prestige"] -= (assignment.completed) ? 1 : 0;
    }

    // Loop through every player & find those with prestige == 1 (killed & !got killed)
    for(var p in players) {
        var player = players[p];

        if(player["prestige"] == 1) {

            player["reason"] = "both";

            survivors.push(player);
            delete players[p];

            spotsleft--;
            statistics.top++;
        }
    }

    // Find all those who have prestige = 0
    for(var p in players) {
        var player = players[p];

        if(player["prestige"] == 0) {
            medians.push(player);
            delete players[p];
        }
    }

    // Shuffle that array and pick the first spotsleft
    medians = shuffle(medians);
    for(var i = 0; i < spotsleft && i < medians.length; i++) {
        
        if(medians[i]["killed"]) {
            medians[i]["reason"] = "both";
        } else {
            medians[i]["reason"] = "neither";
        }

        survivors.push(medians[i]);
        spotsleft--;
    }

    // Pick all those who have prestige zero (They should be all that's left)
    for(var p in players) {
        bottom.push(players[p]);
    }

    // Shuffle the array and pick the first spotsleft
    var bottom = shuffle(bottom);
    for(var i = 0; i < spotsleft && i < bottom.length; i++) {
        bottom[i]["reason"] = "lucky";
        survivors.push(bottom[i]);
        spotsleft--;
    }

    return survivors;
}*/

/**
 * Gets the survivors of a round
 * @param {int} round id of the round
 * @returns {Object[]} All player objects that killed their target & didn't die
 */
async function survivors(round, token, context) {

    var { getPlayers, updatePlayer } = require('../db/players.js');
    var { getGameFromRound } = require('../db/rounds.js');
    
    var game = await getGameFromRound(round);
    var dbplayers = await getPlayers(game.id, true, true, undefined, undefined, token, context);
    var survivors = [];

    // Make sure they completed their assignment
    var database = await get_database_connection();
    for(var p = 0; p < dbplayers.length; p++) {
        var result = await database.query("SELECT completed FROM targets WHERE killer=? AND round=?", [dbplayers[p]['id'], round]);
        if(result[0]["completed"] == 1) {
           survivors.push(dbplayers[p]); 
        } else {

            // Kill the player
            updatePlayer(dbplayers[p].id, {
                alive: false
            })

            // Notify them why they died
        }
    }

    database.destroy();

    return survivors;
}

module.exports = {
    survivors
}
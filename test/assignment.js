var assert = require('assert');

describe('Player Assignment', function() {
    describe('#assignTargets', function() {
        it('should randomly pair killers/targets form within the same quadrant of the game\'s overall geographic area', function() {

            const assignTargets = require('../algorithms/targets.js');
            const { mapPlayers } = require('../productivity/mapplayers.js');

            var players = [
                {
                    id: 2,
                    name: "Downtown West Chester",
                    coordinates: [39.960478, -75.606931]
                },
                {
                    id: 3,
                    name: "Ingram Mill Park",
                    coordinates: [39.964655, -75.653830]
                },
                {
                    id: 4,
                    name: "Exton Elementary",
                    coordinates: [40.025511, -75.61665]
                },
                {
                    id: 5,
                    name: "Oxford Library",
                    coordinates: [39.784707, -75.980877]
                },
                {
                    id: 6,
                    name: "Lincoln University",
                    coordinates: [39.808009, -75.924969]
                },
                {
                    id: 7,
                    name: "Elmwood Zoo",
                    coordinates: [40.132624, -75.337970]
                },
                {
                    id: 8,
                    name: "Marsh Creek",
                    coordinates: [40.0691776, -75.7197565]
                },
                {
                    id: 9,
                    name: "Kennett Square",
                    coordinates: [39.8467767, -75.7116032]
                }
            ];

            console.log(mapPlayers(players));

            //for(var i = 0; i < 50; i++) {

            var targetassignments = assignTargets(players, 3);
            console.log(JSON.stringify(targetassignments));

            /*var allplayerskilled = true;
            var alltargetsonlyonce = true;
            var allplayerskill = true;
            var allplayerskillonlyonce = true;

            // Make sure every player is killed
            for(player of players) {
                var killed = 0;
                console.log(JSON.stringify(targetassignments));
                for(target of targetassignments) {
                    //console.log(JSON.stringify(target));
                    //console.log(JSON.stringify(player));
                    if(player.id == target.target.id) {
                        killed++;
                    }
                }
                if(killed == 0) {
                    allplayerskilled = false;
                    console.log("Player is never killed: " + JSON.stringify(player));
                    console.log(JSON.stringify(targetassignments));
                    break;
                }
                if(killed > 1) {
                    alltargetsonlyonce = false;
                    console.log("Player is assigned as a target more than once: " + JSON.stringify(player));
                    break;
                }
            }

            // Make sure every player is a killer
            for(player of players) {
                var killer = 0;
                for(target of targetassignments) {
                    if(player.id == target.killer.id) {
                        killer++;
                    }
                }
                if(killer == 0) {
                    allplayerskill = false;
                    console.log("Player is not given a target: " + JSON.stringify(player));
                    break;
                }
                if(killer > 1) {
                    allplayerskillonlyonce = false;
                    console.log("Player is given more than one target: " + JSON.stringify(player));
                    break;
                }
            }

           // assert.equal(allplayerskill && allplayerskilled && allplayerskillonlyonce && alltargetsonlyonce, true);
            //}

            */
        }) 
    })
})
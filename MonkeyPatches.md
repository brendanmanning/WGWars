## Game
For right now, the multiple game feature is not being implemented, but space is being left in the database for it to be added later. For that reason, some things will be "monkey-patched"/"hardcoded" in the meantime. Checks means the patchwork is resolved.
- [ ] createRound(game, survivors) is called with argument of 1 in 
- [ ] getRound(game) is called with argument of 1 in 

## Player
- [ ] db/players.js createPlayer assumes created players are alive on two different lines
- [ ] db/players.js updatePlayer manually converts booleans to integers 

## Math
- [ ] algorithms/math.js distance does not use the halversine formula for an accurate calculation. Given the likeliness that players will live close-by, a projection onto a standard cartesian plane is acceptable.
- [ ] algorithms/target.js assignTargets does not reassign to centroids after the initial centroid assignment as been done (See page 19 of https://web.stanford.edu/class/cs345a/slides/12-clustering.pdf) 

## Target Assignments
- [ ] De-mapping and Re-mapping is VERY algorithmetically expensive

## rounds.js
- [ ] return the 0th index of the sql array
var get_database_connection = require('../db.js');
var { getPlayer } = require('./players.js');

/**
 * Create a new feed item
 * @param {int} creator the database id of the player that created this post 
 * @param {Object} data the post's data in stringified JSON format
 * @returns {Object} the newly created post as a JSON object or undefined on error
 */
async function createPost(game, creator, data) {

    var database = await get_database_connection();

    var timestamp = new Date() / 1000;
    var result = await database.query("INSERT INTO feed (game, creator, data, timestamp) VALUES (?,?,?,?)", [game, creator, data, timestamp]);

    creator = await getPlayer(creator);

    return {
        id: result['insertId'],
        game: game,
        creator: creator,
        data: data,
        timestamp: timestamp
    };
}

/**
 * Gets all the post items for a game
 * @param {int} game The game ID to fetch posts for
 * @returns {Object[]} an array of post object
 */
async function getPosts(game) {
    var database = await get_database_connection();
    var results = await database.query("SELECT id, creator, data, timestamp FROM feed WHERE visible=1 AND game=?");
    
    for(var i = 0; i < results.length; i++) {
        results[i]['creator'] = await getPlayer(results[i]['creator']);
    }
    
    return results;  
}

module.exports = {
    createPost,
    getPosts
};
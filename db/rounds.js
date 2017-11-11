var get_database_connection = require('../db.js');

async function createRound(survivors) {
    var database = await get_database_connection();
    var result = await database.query(
        'INSERT INTO rounds (game, survivors) VALUES (1,?)',  
        [survivors]
    );
}
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PlayerType = require('../../types/player.js');
const { updatePlayer } = require('../../../db/players.js');

const updatePlayerGQL = {
    type: PlayerType,
    description: "Update information for player",
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "The ID of the player to update"
        },
        name: {
           type: GraphQLString,
           description: 'This player\'s name'
        },
        email: {
            type: GraphQLString,
            description: 'This player\'s email (should not be publically visible)'
        },
        alive: {
            type: GraphQLBoolean,
            description: 'Is the user alive?'
        },
        paid: {
            type: GraphQLBoolean,
            description: "Has the user paid the game admin for access yet?"
        },
        pnid: {
            type: GraphQLString,
            description: "This player's device ID for the push notification service we're using"
        },
        coordinates: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The geographic coordinates ("latitude,longitude") of this player\'s home'
        }
    },
    resolve: (root, {id, name, email, alive, paid, pnid, coordinates}) => {
        return updatePlayer(id, {
            name: name,
            email: email,
            alive: alive, 
            paid: paid, 
            pnid: pnid, 
            coordinates: coordinates
        });
    }
}

module.exports = updatePlayerGQL;
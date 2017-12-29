const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PlayerType = require('../../types/player.js');
const { createPlayer } = require('../../../db/players.js');

const createPlayerGQL = {
    type: PlayerType,
    description: "Create a new player",
    args: {
        name: {
           type: new GraphQLNonNull(GraphQLString),
           description: 'This player\'s name'
        },
        email: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This player\'s email (should not be publically visible)'
        },
        phone: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This player\'s mobile phone number'
        },
        uid: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This player\'s Firebase UID'
        },
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The game this player belongs to'
        },
        coordinates: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The geographic coordinates ("latitude,longitude") of this player\'s home'
        }
    },
    resolve: (root, {name, email, phone, uid, game, coordinates}) => {
        return createPlayer(name, email, phone, uid, game, coordinates);
    }
}

module.exports = createPlayerGQL;
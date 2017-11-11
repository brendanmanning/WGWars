const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const playerType = require('../../types/player.js');
const { createPlayer } = require('../../../db/players.js');

const createPlayerGQL = {
    type: playerType,
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
        game: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        coordinates: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The geographic coordinates ("latitude,longitude") of this player\'s home'
        }
    },
    resolve: (root, {name, email, game, coordinates}) => {
        return createPlayer(name, email, game, coordinates);
    }
}

module.exports = createPlayerGQL;
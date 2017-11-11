const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList
} = require('graphql');

const PlayerType = require('../../types/player.js');

const { createPlayer, getPlayer } = require('../../../db/players.js');

/**
 *  Defines the GraphQL player(id: Int) query
 */
var selectPlayer = {
    type: PlayerType,
    args: {
        id: {
            description: 'ID of the player object',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: (root, { id }) => getPlayer(id)
};

/**
 * Defines the GraphQL players(game: Int, alive: Bool?, count: Int?, offset: Int?)
 */
var selectPlayers = {
    type: GraphQLList(PlayerType),
    args: {
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Game for which to select players'
        },
        alive: {
            type: GraphQLBoolean,
            description: 'Show only users which are still alive?'
        },
        count: {
            type: GraphQLInt,
            description: 'How many players should be shown?'
        },
        offset: {
            type: GraphQLInt,
            description: 'Specify an offset (useful for pagation)'
        }
    }
}

module.exports = { selectPlayer, selectPlayers };
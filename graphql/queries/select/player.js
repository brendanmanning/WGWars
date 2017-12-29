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

const { createPlayer, getPlayer, getPlayers } = require('../../../db/players.js');

/**
 *  Defines the GraphQL player(id: Int) query
 */
var selectPlayer = {
    type: PlayerType,
    args: {
        id: {
            description: 'ID of the player object',
            type: new GraphQLNonNull(GraphQLInt)
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, { id , token }) => getPlayer(id, token, false)
};

/**
 * Defines the GraphQL players(game: Int, alive: Bool?, count: Int?, offset: Int?)
 */
var selectPlayers = {
    type: new GraphQLList(PlayerType),
    description: "Selects players from a game.",
    args: {
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Game for which to select players'
        },
        alive: {
            type: GraphQLBoolean,
            description: 'Show only users which are/are not still alive?'
        },
        paid: {
            type: GraphQLBoolean,
            description: 'Show only users which have/have not paid the admin yet'
        },
        count: {
            type: GraphQLInt,
            description: 'How many players should be shown?'
        },
        offset: {
            type: GraphQLInt,
            description: 'Specify an offset (useful for pagation)'
        }
    },
    resolve: (root, { game, alive, paid, count, offset}, context) => getPlayers(game, alive, paid, count, offset, context)
}

module.exports = { selectPlayer, selectPlayers };
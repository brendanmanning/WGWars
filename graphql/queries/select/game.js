const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList
} = require('graphql');

const GameType = require('../../types/game.js');

const { getGame } = require('../../../db/games.js');

/**
 *  Defines the GraphQL game(id: Int, token: String) query
 */
var selectGame = {
    type: GameType,
    args: {
        id: {
            description: 'ID of the game, If none is specified, the game the user (based on token) is in will be used',
            type: GraphQLInt
        },
        token: {
            description: 'Firebase auth token of requesting user',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, { id, token}, context) => getGame(id, token, context)
};

module.exports = {
    selectGame
}
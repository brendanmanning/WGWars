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

const { getPlayerByUID } = require('../../../db/players.js');

/**
 *  Defines the GraphQL player(id: Int) query
 */
var selectPlayer = {
    type: PlayerType,
    args: {
        uid: {
            description: 'Firebase UID of the player object',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: (root, { uid }, context) => getPlayer(uid, context, false);
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList
} = require('graphql');

const DisputeType = require('../../types/dispute.js');

const { getDispute, getDisputes } = require('../../../db/disputes.js');

/**
 *  Defines the GraphQL player(id: Int) query
 */
var selectDispute = {
    type: DisputeType,
    args: {
        id: {
            description: 'ID of the dispute object',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: (root, { id }, context) => getDispute(id, context)
};

/**
 * Selects all disputes on a game & round
 */
var selectDisputes = {
    type: new GraphQLList(DisputeType),
    description: "Selects disputes for a round.",
    args: {
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Game for which to select disputes'
        },
        currentRoundOnly: {
            type: new GraphQLBoolean,
            description: 'Disputes for game\'s current round only?'
        }
    },
    resolve: (root, { round, currentRoundOnly }) => getDisputes(round, currentRoundOnly)
}

module.exports = {
    selectDispute,
    selectDisputes
}
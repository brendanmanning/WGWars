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
        round: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Round for which to select disputes'
        },
    },
    resolve: (root, { round }) => getDisputes(round)
}

module.exports = {
    selectDispute,
    selectDisputes
}
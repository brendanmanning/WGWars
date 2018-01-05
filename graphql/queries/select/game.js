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
 *  Defines the GraphQL game(id: Int, token: String) query
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
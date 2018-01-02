const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const DisputeType = require('../../types/dispute.js');
const { createDispute } = require('../../../db/disputes.js');

const createDisputeGQL = {
    type: DisputeType,
    description: "Create a new dispute",
    args: {
        complainer: {
            type: new GraphQLNonNull(GraphQLInt),
            description: '0 if the killer is complaining / 1 if the target is complaining'
        },
        assignment: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of target assignment this dispute is about'
        },
        comment: {
            type: new GraphQLNonNull(GraphQLString),
            description: "What the killed player has to say"
        }
    },
    resolve: (root, {complainer, assignment, comment}, context) => {
        return createDispute(complainer, assignment, comment, context);
    }
}

module.exports = createDisputeGQL;
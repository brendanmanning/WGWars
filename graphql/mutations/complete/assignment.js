const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const AssignmentType = require('../../types/assignment.js');
const { completeAssignment } = require('../../../db/assignments.js');

const completeAssignmentGQL = {
    type: AssignmentType,
    description: "Kills a player (completes a target assignment)",
    args: {
        id: {
           type: new GraphQLNonNull(GraphQLInt),
           description: 'Id of the assignment to kill'
        },
        video: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Video of the kill'
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {id, video, token}, context) => {
        return completeAssignment(id, video, token, context);
    }
}

module.exports = completeAssignmentGQL;
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
        }
    },
    resolve: (root, {id}) => {
        return completeAssignment(id);
    }
}

module.exports = completeAssignmentGQL;
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const AssignmentType = new GraphQLObjectType({
    name: 'Assignment',
    description: 'Defines who should kill who',
    fields: () => ({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this assignment'
         },
         killer: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The id of the player doing the killing'
         },
         target: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The id of the player being killed'
         },
         completed: {
             type: GraphQLBoolean,
             description: "Has the target been killed yet?"
         }
    })
})

module.exports = AssignmentType;
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PlayerType = require('player.js');

const AssignmentType = new GraphQLObjectType({
    name: 'Assignment',
    description: 'Defines who should kill who',
    fields: () => ({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this assignment'
         },
         killer: {
             type: PlayerType,
             description: 'The player doing the killing'
         },
         target: {
             type: PlayerType,
             description: 'The player being killed'
         },
         completed: {
             type: GraphQLBoolean,
             description: "Has the target been killed yet?"
         }
    })
})

module.exports = AssignmentType;
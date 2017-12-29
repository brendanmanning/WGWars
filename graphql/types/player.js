const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    description: 'A participant in the game',
    fields: function() {
        const AssignmentType = require('./assignment.js');
        return({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this user'
         },
         name: {
             type: new GraphQLNonNull(GraphQLString),
             description: 'This\'s player\'s human name'
         },
         email: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This player\'s email address'
         },
         phone: {
             type: new GraphQLNonNull(GraphQLString),
             description: 'This player\'s phone number'
         },
         image: {
            type: GraphQLString,
            description: 'The URL of this player\'s profile icon'
         },
         alive: {
             type: GraphQLBoolean,
             description: "Is the player still alive?"
         },
         assignment: {
             type: AssignmentType,
             description: "The assignment object for the player this round"
         }
        });
    }
})

module.exports = PlayerType;
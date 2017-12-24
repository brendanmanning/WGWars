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
    fields: () => ({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this user'
         },
         name: {
             type: new GraphQLNonNull(GraphQLString),
             description: 'This\'s player\'s human name'
         },
         alive: {
             type: GraphQLBoolean,
             description: "Is the player still alive?"
         },
         target: {
             type: PlayerType,
             description: "The player they are assigned to kill this round (if there is one)"
         }
    })
})

module.exports = PlayerType;
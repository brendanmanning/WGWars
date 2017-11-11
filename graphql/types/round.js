const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const roundType = new GraphQLObjectType({
    name: 'Round',
    description: 'A round is simply an organizational structure. Rounds define how many players may be left afterwards, but when the round starts and ends is entirely upon the game admin to define. Admins must manually click a button to advance to a new round',
    fields: () => ({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this round'
         },
         game: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The game this round is attatched to'
         },
         survivors: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'There will be no more than this number of players alive after the round'
         },
         active: {
             type: GraphQLBoolean,
             description: "Is this round currently happening?"
         }
    })
})

module.exports = roundType;
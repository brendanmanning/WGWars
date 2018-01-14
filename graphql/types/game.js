const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const GameType = new GraphQLObjectType({
    name: 'Game',
    description: 'A game is simply an organizational structure.',
    fields: function() {
        const PlayerType = require('./assignment.js');
        const roundType = require('./round.js');
        return({
         id: {
             type: GraphQLInt,
             description: 'The unique identifier for this game.'
         },
         currentRound: {
             type: GraphQLInt,
             description: 'The game this round is attatched to'
         },
         state: {
             type: new GraphQLNonNull(GraphQLInt),
             description: "0=SIGNUP 1=PLAYING 2=OVER"
         }
    })}
})

module.exports = GameType;
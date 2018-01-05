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
        const roundType = require('./round.js');
        const GameType = require('./game.js');
        return({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this user'
         },
         game: {
             type: new GraphQLNonNull(GameType),
             description: 'The id of the game this player is in'
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
         pnid: {
             type: GraphQLString,
         },
         image: {
            type: GraphQLString,
            description: 'The URL of this player\'s profile icon'
         },
         alive: {
             type: GraphQLBoolean,
             description: "Is the player still alive?"
         },
         isAdmin: {
             type: GraphQLBoolean,
             description: 'Is the player the admin of the game they are currently in?'
         },
         assignment: {
             type: AssignmentType,
             description: "The assignment object for the player this round"
         },
         eliminationRoundId: {
             type: GraphQLInt,
             description: 'The round in which this player was eliminated'
         },
         killer: {
             type: PlayerType,
             description: 'The player who killed this player'
         }
        });
    }
})

module.exports = PlayerType;
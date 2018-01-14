const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const roundType = require('../../types/round.js');
const { fullyDoNewRound } = require('../../../db/rounds.js');

const roundChain = {
    type: roundType,
    description: "Create a new round, end all existing ones, activate the new round",
    args: {
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "The game to a create a round in"
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {game, token}, context) => {
        return fullyDoNewRound(game, token, context);
    }
}

module.exports = roundChain;
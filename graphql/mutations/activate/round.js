const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const roundType = require('../../types/round.js');
const { activateRound } = require('../../../db/rounds.js');

const activateRoundGQL = {
    type: roundType,
    description: "Start an existing round",
    args: {
        round: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "The id of the round to begin"
        }
    },
    resolve: (root, {round}) => {
        return activateRound(round);
    }
}

module.exports = activateRoundGQL;
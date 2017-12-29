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
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "The id of the round to begin"
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {id, token}) => {
        return activateRound(id, token);
    }
}

module.exports = activateRoundGQL;
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const roundType = require('../../types/round.js');
const { endRound } = require('../../../db/rounds.js');

const endRoundGQL = {
    type: roundType,
    description: "End a round",
    args: {
        id: {
           type: new GraphQLNonNull(GraphQLInt),
           description: "The id of the round to end"
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {id, token}, context) => {
        return endRound(id, token, context);
    }
}

module.exports = endRoundGQL;
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
        }
    },
    resolve: (root, {id}, context) => {
        return endRound(id, context);
    }
}

module.exports = endRoundGQL;
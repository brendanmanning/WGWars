const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const roundType = require('../../types/round.js');
const { createRound } = require('../../../db/rounds.js');

const createRoundGQL = {
    type: roundType,
    description: "Create a new round",
    args: {
        game: {
           type: new GraphQLNonNull(GraphQLInt),
           description: "The id of the game to attatch this round to"
        }
    },
    resolve: (root, {game}, context) => {
        return createRound(game, context);
    }
}

module.exports = createRoundGQL;
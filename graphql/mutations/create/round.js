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
        },
        survivors: {
            type: new GraphQLNonNull(GraphQLInt),
            description: "The maximum number of players which should remain after this round"
        }
    },
    resolve: (root, {game, survivors}) => {
        return createRound(game, survivors);
    }
}

module.exports = createRoundGQL;
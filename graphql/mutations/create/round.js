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
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {game, token}) => {
        return createRound(game, token);
    }
}

module.exports = createRoundGQL;
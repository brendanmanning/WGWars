// schema.js
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const { createPlayer, getPlayer } = require('./db/players.js');

/**
 * Import any required types
 */
const PlayerType = require('./graphql/types/player.js');

/**
 * Import any requried GraphQL queries
 */
const { selectPlayer, selectPlayers } = require('./graphql/queries/select/player.js');

/**
 * Import any required GraphQL mutation handlers
 */
const createPlayerGQL = require('./graphql/mutations/create/player.js');
const createRoundGQL = require('./graphql/mutations/create/round.js');
const updatePlayerGQL = require('./graphql/mutations/update/player.js');
const activateRoundGQL = require('./graphql/mutations/activate/round.js');
const completeAssignmentGQL = require('./graphql/mutations/complete/assignment.js');

/**
 * Define query handlers
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        player: selectPlayer,
        players: selectPlayers
    })
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPlayer: createPlayerGQL,
        createRound: createRoundGQL,
        updatePlayer: updatePlayerGQL,
        activateRound: activateRoundGQL,
        completeAssignment: completeAssignmentGQL
    }
})

module.exports = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [ PlayerType ],
});
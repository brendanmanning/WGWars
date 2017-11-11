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
const playerType = require('./graphql/types/player.js');

/**
 * Import any requried GraphQL queries
 */
const selectPlayer = require('./graphql/queries/select/player.js');
/**
 * Import any required GraphQL mutation handlers
 */
const createPlayerGQL = require('./graphql/mutations/create/player.js');
const createRoundGQL = require('./graphql/mutations/create/round.js');

/**
 * Define query handlers
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        player: selectPlayer
    })
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPlayer: createPlayerGQL,
        createRound: createRoundGQL
    }
})

module.exports = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [ playerType ],
});
  
  /*type Game {
    admin: Player
    rounds: [Round]
    state: GameState
    winners: [Player]
}
type Round {
    survivors: Integer
    active: Boolean
    start: Integer
    end: Integer
}
type Player {
    id: String
    name: String
    email: String
    verified: Boolean
    alive: Boolean
    target: Player
}

enum GameState {
    NOTSTARTED
    ACTIVE
    FINISHED
}*/

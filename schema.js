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
const { selectGame } = require('./graphql/queries/select/game.js');
const { selectPlayer, selectPlayers, me } = require('./graphql/queries/select/player.js');
const { selectDispute, selectDisputes } = require('./graphql/queries/select/dispute.js');
const { selectPosts } = require('./graphql/queries/select/post.js');

/**
 * Import any required GraphQL mutation handlers
 */
const createPlayerGQL = require('./graphql/mutations/create/player.js');
const createRoundGQL = require('./graphql/mutations/create/round.js');
const updatePlayerGQL = require('./graphql/mutations/update/player.js');
const roundChain = require('./graphql/mutations/chains/round.js');
const activateRoundGQL = require('./graphql/mutations/activate/round.js');
const endRoundGQL = require('./graphql/mutations/end/round.js');
const completeAssignmentGQL = require('./graphql/mutations/complete/assignment.js');
const createDispute = require('./graphql/mutations/create/dispute.js');
const createPost = require('./graphql/mutations/create/post.js');

/**
 * Define query handlers
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        player: selectPlayer,
        me: me,
        players: selectPlayers,
        dispute: selectDispute,
        disputes: selectDisputes,
        game: selectGame,
        posts: selectPosts
    })
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPlayer: createPlayerGQL,
        
        updateSelf: updatePlayerGQL,
        
        completeAssignment: completeAssignmentGQL,
        createDispute: createDispute,
        createPost: createPost,
        roundChain: roundChain
    }
})

module.exports = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    types: [ PlayerType ],
});
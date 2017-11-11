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
  
const playerType = new GraphQLObjectType({
   name: 'Player',
   description: 'A participant in the game',
   fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The unique identifier for this user'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This\'s player\'s human name'
        },
        alive: {
            type: GraphQLBoolean,
            description: "Is the player still alive?"
        }
   })
})

/**
 * Define query handlers
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        player: {
            type: playerType,
            args: {
                id: {
                    description: 'ID of the player object',
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (root, { id }) => getPlayer(id)
        }
    })
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPlayer: {
            type: playerType,
            description: "Create a new player",
            args: {
                name: {
                   type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                game: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                coordinates: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, {name, email, game, coordinates}) => {
                return createPlayer(name, email, game, coordinates);
            }
        }
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

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList
} = require('graphql');

const PostType = require('../../types/post.js');

const { getPosts } = require('../../../db/posts.js');

/**
 * Defines the GraphQL posts(game: Int, count: Int?, offset: Int?)
 */
var selectPosts = {
    type: new GraphQLList(PostType),
    description: "Selects players from a game.",
    args: {
        game: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Game for which to select posts'
        },
        count: {
            type: GraphQLInt,
            description: 'How many posts should be shown?'
        },
        offset: {
            type: GraphQLInt,
            description: 'Specify an offset (useful for scroll)'
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, { game, count, offset, token} , context) => getPosts(game, count, offset, token, context)
}

module.exports = { selectPosts };
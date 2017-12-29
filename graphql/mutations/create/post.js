const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PostType = require('../../types/post.js');
const { createPost } = require('../../../db/posts.js');

const createPostGQL = {
    type: PostType,
    description: "Create a new post",
    args: {
        game: {
           type: new GraphQLNonNull(GraphQLInt),
           description: 'The id of the game to use'
        },
        creator: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the player creating this post'
        },
        data: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The data for this post in stringified JSON form'
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A firebase token for providing access'
        }
    },
    resolve: (root, {game, creator, data, token}) => {
        return createPost(game, creator, data, token);
    }
}

module.exports = createPostGQL;
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'A post in the game\'s feed',
    fields: function() {
        const PlayerType = require('./player.js');
        return({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this post'
         },
         game: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The game this was posted to'
         },
         creator: {
             type: PlayerType,
             description: 'The profile of the player that made this post'
         },
         data: {
             type: GraphQLString,
             description: "The JSON data encoded in this post as a string"
         },
         timestamp: {
             type: new GraphQLNonNull(GraphQLInt),
             description: "The timestamp (in seconds since epoch) when this was posted"
         }
        });
    }
})

module.exports = PostType;
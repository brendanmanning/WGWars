const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLString
} = require('graphql');

const DisputeType = new GraphQLObjectType({
    name: 'Dispute',
    description: 'When a player protests their being killed',
    fields: () => ({
         id: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The unique identifier for this dispute'
         },
         round: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The round in which this dispute occurred'
         },
         killer: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The killer being disputed (or -1 if a generic dispute)'
         },
         target: {
             type: new GraphQLNonNull(GraphQLInt),
             description: 'The target doing the disputing (or -1 if a generic dispute)'
         },
         comment: {
             type: new GraphQLNonNull(GraphQLString),
             description: "What happened?"
         },
         resolved: {
             type: new GraphQLNonNull(GraphQLBoolean),
             description: "Has this been resolved yet?"
         }
    })
})

module.exports = DisputeType;
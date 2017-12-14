// Imports for GraphQL
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
// Use Babel for ES2015

// Schemas, Objects, etc
var schema = require('./schema');

// Imports for my own programming
var fs = require('fs');

/*
// Construct a schema, using GraphQL schema language
var schema = buildSchema(fs.readFileSync(__dirname + '/schema.gql'));

// The root provides a resolver function for each API endpoint
var root = {
  game: () => {
    admin: () => {
        //return 
    }
    rounds: () => {

    }
  },
  player: () => {
      name: () => {
          return "Brendan Manning";
      }
      email: () => {
          return "BrendanManning19380@gmail.com";
      }
  }
};*/

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
 app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


var async = require('asyncawait/async');
var await = require('asyncawait/await');



var get_database_connection = require('./db.js');
var { getPlayers } = require('./db/players');


async function main() {
  var database = await get_database_connection();
  var results = await database.query('select * from players');
  for(result of results) {
    //console.log(JSON.stringify(result));
  }
}

main();

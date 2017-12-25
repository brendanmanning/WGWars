// Imports for GraphQL
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
// Use Babel for ES2015

// Schemas, Objects, etc
var schema = require('./schema');

// Imports for my own programming
var fs = require('fs');

var cors = require('cors');

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
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method");
  next();
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: {
  
  },
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

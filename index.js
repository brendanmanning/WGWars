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
var admin = require("firebase-admin");

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


// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method");
   next();
});


// Connect with Firebase
var serviceAccount = require("./firebaseprivatekey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wgwars-b03fd.firebaseio.com"
});


// Bind to GraphQL
var buildcontext = require('./buildcontext.js');
app.use('/graphql', graphqlHTTP(async (request, response, graphQLParams) => ({

    schema: schema,
    graphiql: true,
    pretty: true
  
})));

 app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


var async = require('asyncawait/async');
var await = require('asyncawait/await');
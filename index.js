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
/*
app.use('/graphql', jwt({
  secret: 'shhhhhhared-secret',
  requestProperty: 'auth',
  credentialsRequired: false,
}));*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method");
  next();
});
app.use('/graphql', function(req, res, done) {
  const user = db.User.get(req.auth.sub);
  req.context = {
    user: user,
  }
  done();
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  context: {
    requester: {
      id: 16,
      assignment: {
        killer: 16,
        target: 19
      }
    }
  },
  graphiql: true,
}));
 app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


var async = require('asyncawait/async');
var await = require('asyncawait/await');
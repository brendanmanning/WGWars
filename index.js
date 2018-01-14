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
var get_database_connection = require('./db.js');
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
app.use('/graphql', graphqlHTTP({

    schema: schema,
    graphiql: true,
    pretty: true,
    context: {
      admin: admin
    }
}));

// Prepare Stripe
app.use(require("body-parser").urlencoded({extended: false}));
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

// listen for payment actions
app.post('/pay', async function(req, res) { 

    try {

        // Mark the player (by id) as paid before taking their money
        var database = await get_database_connection();
        await database.query("UPDATE players SET paid=1 WHERE email LIKE ?", [req.body.stripeEmail]);
        database.destroy();
        
        // Create the charge
        let amount = 1000;
        var customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        });
        await stripe.charges.create({
            amount,
            description: "Entrance fee for Shanahan Assasian Game",
            currency: "usd",
            customer: customer.id
        })

        res.send('<script>window.location="http://apps.brendanmanning.com/war/thankForStripePayment.php";</script><body>Redirecting...</body>');
    } catch (error) {
        res.send('<script>window.location="http://apps.brendanmanning.com/war/errorForStripePayment.php?error=' + error.message + '";</script><body>Redirecting...</body>');
    }
});

 app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


var async = require('asyncawait/async');
var await = require('asyncawait/await');
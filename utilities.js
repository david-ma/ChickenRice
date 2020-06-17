/**
 * Function to create a new twitter client
 * From index.js, we should move to a utilities.js later.
 * Remember to do some refactoring/cleanup
 */
const Twitter = require('twitter-lite');
const dotenv = require('dotenv').config({
    path: `${__dirname}/.env`
});


function newClient(subdomain = 'api') {
    return new Twitter({
        subdomain: subdomain,
        version: "1.1",
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });
}






exports.newClient = newClient;

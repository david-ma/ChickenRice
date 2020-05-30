
/**
 * Chicken Rice App!
 * 
 * This is a collab by David Ma & Grace Tang
 * We're making an app that will post a picture of Chicken Rice every day
 * 
 * To do this, we need to:
 * - have a folder filled with chicken rice images,
 * - connect to twitter
 * - pick an image and post it
 * - remember which images have already been posted. Move to new folder?
 * 
 * 
 * Stretch goals:
 * - Allow us to choose which image gets posted next?
 * - Meta data? Links to where the image was found/by who?
 * - Allow other people to submit images of chicken rice?
 * 
 * 
**/


require('dotenv').config()
const Twitter = require('twitter-lite');
const fs = require('fs').promises;

const client = new Twitter({
    subdomain: "api",
    version: "1.1",
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});




client
    .get("account/verify_credentials")
    .then(results => {

        console.log("Success!!!!");
        console.log("results", results);

    })
    .catch(console.error);


fs.readdir(`new_images/`)
    .then( function( files ) {
        console.log(files);
    });






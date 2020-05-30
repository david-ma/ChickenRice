
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
const fs = require('fs');


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

var status = `Hello World! Here's your first serving of chicken rice :)`;

var image = fs.readFileSync('new_images/hainanese-chicken-lg-6911.jpg', { encoding: 'base64' });


newClient('upload')
    .post("media/upload", {
        media_data: image,
        status: status
    })
    .then(results => {

        console.log("Success!!!!");
        console.log("results", results);

        newClient().post('statuses/update', {
            status: status,
            media_ids: [results.media_id_string]
        }).then(result => {
            console.log("finish");
            console.log(result);
        }).catch(err => console.log(err));
        
    })
    .catch(console.error);


/*
fs.promises.readdir(`new_images/`)
    .then( function( files ) {
        console.log(files);
    });
*/



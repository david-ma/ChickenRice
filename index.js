#!/usr/local/bin/node

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


require('dotenv').config({
    path: `${__dirname}/.env`
});

const Twitter = require('twitter-lite');
const fs = require('fs');

const fresh_images = `${__dirname}/fresh_images/`;
const posted_images = `${__dirname}/posted_images/`;

var promises = [
    fs.promises.readdir(fresh_images),
    fs.promises.readdir(posted_images)
];

Promise.all(promises).then(function([new_images, old_images]) {
    new_images = ignoreSystemFiles(new_images);
    old_images = ignoreSystemFiles(old_images);

// To do:
// Twitter DM at david & grace if there are less than 5 images in the folder.


// Easy way, just use the next image:
    var nextImage = new_images[0];

    var statuses = [
        "Today's serving of chicken rice",
        "Here's your chicken rice of the day",
        "It's chimkem rice tiem :3",
        "One serving of chicken rice, coming right up."
    ];

    var orderedStatus = statuses[old_images.length % statuses.length];
    var randomStatus = selectRandom(statuses);

    console.log(`Posting this image: ${nextImage} with this status: ${orderedStatus}`);
    postChickenRice(nextImage, orderedStatus);

// Next thing to do:
// Move image from "new images" to "old images" after using it
    fs.rename(`${fresh_images}/${nextImage}`, `${posted_images}/${nextImage}`, function(d){
        console.log(d);
    });


// Also, set up cron job


});




/**
 * Post an image & status to twitter!
 */
function postChickenRice(image, status = `Today's serving of chicken rice` ) {
    var image = fs.readFileSync(`${fresh_images}/${image}`,
        { encoding: 'base64' }
    );

    newClient('upload')
        .post("media/upload", {
            media_data: image,
            status: status
        })
        .then(results => {
    
            newClient().post('statuses/update', {
                status: status,
                media_ids: [results.media_id_string]
            }).then(result => {
                console.log("finish");
                console.log(result);
            }).catch(err => console.log(err));
            
        })
        .catch(console.error);
}

/**
 * Function to create a new twitter client
 */
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

/**
 * Returns a random thing from an array
 */
function selectRandom(array) {
    const length = array.length;
    return array[Math.floor( Math.random() * length )];
}



/**
 * Ignores strings that start with . in an array
 */
function ignoreSystemFiles(array) {
    var newArray = [];
    array.forEach(function(thing){
        if(thing.slice(0,1) != ".") {
            newArray.push(thing);
        }
    });
    return newArray;
}

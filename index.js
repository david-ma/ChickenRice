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

// Also, DM on twitter if less than 5 images left
    if(new_images.length < 5) {

    // David and Grace's twitter accounts: [ 72238031, 219920424 ]
        const dm_targets = [ 72238031, 219920424 ];

        dm_targets.forEach(function(target) {
            newClient().post("direct_messages/events/new", {
                event: {
                    type: "message_create",
                    message_create: {
                        target: {
                            recipient_id: target
                        },
                        message_data: {
                            text: "We're running out of Chicken Rice images. Oh no!"
                        }
                    }
                }
            }).then(results => {
                console.log("DM sent:", results);
            }).catch(error => {
                console.log("Error sending DM", error);
            });
        });
    }


});




/**
 * Post an image & status to twitter!
 */
function postChickenRice(image_filename, status = `Today's serving of chicken rice` ) {
    var image_data = fs.readFileSync(`${fresh_images}/${image_filename}`,
        { encoding: 'base64' }
    );

    // Upload the image
    newClient('upload')
        .post("media/upload", {
            media_data: image_data,
            status: status
        })
        .then(results => {
    
            // Once the image has been uploaded, post the status, with the image
            newClient().post('statuses/update', {
                status: status,
                media_ids: [results.media_id_string] // include the image "media id string" here
            }).then(result => {
                console.log("Successfully posted on Twitter!");
                console.log(result);

                // Move image from "new images" to "old images" after using it
                // Only move image, if image was successfully posted.
                fs.rename(`${fresh_images}/${image_filename}`, `${posted_images}/${image_filename}`, console.error);

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

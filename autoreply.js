#!/usr/local/bin/node

const newClient = require("./utilities").newClient;

const dotenv = require('dotenv').config({
    path: `${__dirname}/.env`
});
const { Autohook } = require('twitter-autohook');

// options
const opts = {
    token: process.env.ACCESS_TOKEN,
    oauth_token: process.env.ACCESS_TOKEN,
    token_secret: process.env.ACCESS_TOKEN_SECRET,
    oauth_token_secret: process.env.ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    port: process.env.PORT,  // consumed directly from .env, might not need to include it here.
    env: 'sandbox',
    url: 'david-ma.net'
};

console.log(`Starting on twitter autohook listener on port ${opts.port}`);

// try {
//     //   { token: process.env.ACCESS_TOKEN, token_secret: , consumer_key: , consumer_secret: , oauth_token: process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET, env: process.env }

//     const webhook = new Autohook(opts);
//     console.log("token?? ", process.env.ACCESS_TOKEN);


//     webhook.on('event', async event => {
//         // Don't worry, we'll start adding something more meaningful
//         // in just a moment.
//         console.log('You received an event!', event);

//         if (event.direct_message_events) {
//             sayHi(event);
//         }
//     });

//     // Removes existing webhooks
//     webhook.removeWebhooks();

//     // Starts a server and adds a new webhook
//     webhook.start();

//     // Subscribes to your own user's activity
//     webhook.subscribe(opts);
// } catch (e) {
//     // Display the error and quit
//     console.error(e);
//     process.exit(1);
// }


(async ƛ => {
    const webhook = new Autohook(opts);

    // Removes existing webhooks
    await webhook.removeWebhooks();

    // Listens to incoming activity
    webhook.on('event', doEvent);

    // Starts a server and adds a new webhook
    await webhook.start();

    // Subscribes to a user's activity
    await webhook.subscribe(opts);
})().then(d => {
    console.log("Webhooks successfully activated");
}).catch(console.error);




    // David and Grace's twitter accounts: [ 72238031, 219920424 ]
    const admins = [ '72238031', '219920424' ];
    const bot_id = '1266609872826560512'; 

function doEvent(event) {
    // console.log('Something happened:', event);
    // direct_message_events

    if(event.direct_message_events) {
// Listen to direct messages
// automatically download images if someone has sent us one
        console.log("Hey, it looks like we have a direct message!", event.direct_message_events)
        console.log("message is: ", event.direct_message_events[0].message_create.message_data);

        var messager = Object.keys(event.users).filter(user => user != bot_id)[0];
 
        if( event.direct_message_events[0].message_create.sender_id == bot_id ) {
            // If the bot sent the message, don't do anything

            // Probably don't do anything if no image was attached
        } else {
            // Getting the message id and send it to twitter to ask for the actual message
            newClient().get('direct_messages/events/show', {
                // Might get error if we don't receive exactly 1 message at a time
                id: event.direct_message_events[0].id

            }).then(result => {
                // Is messager in the list of admins?
                // What position is the messager in if so? Return -1 if it isn't
                if (admins.indexOf(messager) >= 0) { // If the messager is in the list of admins, send it straight to fresh images
                    downloadMedia(event.users[messager].screen_name, "fresh_images", result.event.message_create.message_data);
                } else { //otherwise, it goes in user submissions
                    downloadMedia(event.users[messager].screen_name, "user_submissions", result.event.message_create.message_data);
                }
            }).catch(err => console.log(err));
        }

    } else if( event.follow_events) {
        //DM the new follower 
        var message = `Hello World, thank you for following the ChickenRiceBot!

If you would like to help our mission to spread the joy of chicken rice, send us chic pics here: https://www.dropbox.com/request/HHcnHKtnxqm9LSOScZe9
Your name will be credited in the tweet 📸

Fun Fact: This is a bot by @Frostickle and @Busycrying to practice coding :)`

// console.log(event.follow_events[0]);

        // Getting the user id and send it to twitter with the welcome message
        newClient().post('direct_messages/events/new', {
            event: {
                type: "message_create",
                message_create: {
                    target: {
                        recipient_id: event.follow_events[0].source.id
                    },
                    message_data: {
                        text: message
                    }
                }
            }
        }).then(function(result){
            // console.log("This is what comes back from twitter when it's succesffulll", result);

        }).catch(err => console.log(err));


    } else {
        console.log("This was not a direct message or follow event.", Object.keys(event));
        // filter unnecessary info? 
    }

}

/**
 * Download an image from a twitter DM to a folder.
 * Probably need to authenticate to grab the image.
 * Rename it after the user who submitted it?
 * Probably check if that filename is already in use, and add a filename-1.jpg or such if it's already being used.
 */
function downloadMedia(filename, folder, dmData) {
    // DO something here
    console.log("I dunno how to do it yet, but it goes here.");
/*
    console.log(`media is...`, result.event.message_create.message_data.attachment);
    // Once we have a DM with a image, try to download the image.

    console.log(`Try to download: ${result.event.message_create.message_data.attachment.media.media_url}`);
    var url = result.event.message_create.message_data.attachment.media.media_url;
    var endstring = url.split('https://ton.twitter.com/1.1/ton/data/dm/')[1];
    console.log(endstring);

    newClient('ton').get(`ton/data/dm/${endstring}#`
    // newClient('ton').get(`ton/data/dm/${event.direct_message_events[0].id}/${result.event.message_create.message_data.attachment.media.id}`
// , {
//     id: result.event.message_create.message_data.attachment.media.id
// }
    ).then(result => {
        console.log("This is what the image looks like:");
        console.log(result);
    }).catch(err => console.log(err));
*/
}




function sayHi(event) {
    // We check that the message is a direct message
    if (!event.direct_message_events) {
        return;
    }

    // Messages are wrapped in an array, so we'll extract the first element
    const message = event.direct_message_events.shift();

    // We check that the message is valid
    if (typeof message === 'undefined' || typeof message.message_create === 'undefined') {
        return;
    }

    // We filter out message you send, to avoid an infinite loop
    if (message.message_create.sender_id === message.message_create.target.recipient_id) {
        return;
    }
    // Prepare and send the message reply
    const senderScreenName = event.users[message.message_create.sender_id].screen_name;

    newClient().post("direct_messages/events/new", {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: message.message_create.sender_id,
                },
                message_data: {
                    text: `Hi @${senderScreenName}! 👋`,
                },
            },
        }
    }).then(console.log)
    .catch(console.error);

}


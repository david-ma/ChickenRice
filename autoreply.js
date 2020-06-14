#!/usr/local/bin/node

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
    // const dm_targets = [ 72238031, 219920424 ];

function doEvent(event) {
    //console.log('Something happened:', event);
    // direct_message_events

    if(event.direct_message_events) {
        console.log("Hey, it looks like we have a direct message!", event.direct_message_events)

    // we need to get the message id and send it to twitter to ask for the actual message

        newClient().get('direct_messages/events/show', {
            // Might get error if we don't receive exactly 1 message at a time
            id: event.direct_message_events[0].id

        }).then(result => {
            console.log("This is what the message says:");
            console.log(result.event.message_create.message_data);

        }).catch(err => console.log(err));



    } else{
        console.log("This was not a direct message.", Object.keys(event))
        // filter unnecessary info? 
    }

}



/**
 * Function to create a new twitter client
 * From index.js, we should move to a utilities.js later.
 * Remember to do some refactoring/cleanup
 */
const Twitter = require('twitter-lite');
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


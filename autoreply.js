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
    webhook.on('event', event => console.log('Something happened:', event));

    // Starts a server and adds a new webhook
    await webhook.start();

    // Subscribes to a user's activity
    await webhook.subscribe(opts);
})().then(d => {
    console.log("Webhooks successfully activated");
}).catch(console.error);



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


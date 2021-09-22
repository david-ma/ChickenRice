"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncForEach = exports.newClient = void 0;
const Twitter = require("twitter-lite");
const dotenv = require("dotenv").config({
    path: `${__dirname}/.env`,
});
function newClient(subdomain = "api") {
    return new Twitter({
        subdomain: subdomain,
        version: "1.1",
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });
}
exports.newClient = newClient;
async function asyncForEach(array, limit, callback) {
    let i = 0;
    for (; i < limit; i++) {
        doNextThing(i);
    }
    function doNextThing(index) {
        if (array[index]) {
            callback(array[index], index, array, function done() {
                doNextThing(i++);
            });
        }
    }
    return 1;
}
exports.asyncForEach = asyncForEach;

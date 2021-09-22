"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const newClient = require("./utilities").newClient();
newClient
    .get("search/tweets", {
    q: "earthquake",
    count: 100,
    tweet_mode: "extended",
    geocode: "-37.813,144.963,1500km",
})
    .then((results) => {
    results.statuses.forEach((status) => {
        database_1.User.findCreateFind({
            where: {
                id: status.user.id,
            },
            defaults: status.user,
        });
        status.userId = status.user.id;
        database_1.Tweet.findCreateFind({
            where: {
                id: status.id,
            },
            defaults: status,
        });
    });
})
    .catch((error) => {
    console.log("Error", error);
});

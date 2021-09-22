"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const newClient = require("./utilities").newClient();
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        const geocode = `-37.${i},144.${j},10km`;
        newClient
            .get("search/tweets", {
            q: "earthquake",
            count: 100,
            tweet_mode: "extended",
            geocode: geocode,
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
                status.geocode = geocode;
                status.coordinates = JSON.stringify(status.coordinates);
                status.geo = JSON.stringify(status.geo);
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
    }
}

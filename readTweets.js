"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const newClient = require("./utilities").newClient();
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        const geocode = `-3${i}.5,14${j}.5,100km`;
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
                        id: status.user.id_str,
                    },
                    defaults: status.user,
                });
                status.userId = status.user.id_str;
                status.geocode = geocode;
                status.coordinates = JSON.stringify(status.coordinates);
                status.geo = JSON.stringify(status.geo);
                database_1.Tweet.findCreateFind({
                    where: {
                        id: status.id_str,
                        geocode: geocode,
                    },
                    defaults: status,
                });
            });
        })
            .catch((error) => {
            console.log("Error", error);
            process.exit(1);
        });
    }
}

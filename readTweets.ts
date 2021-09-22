/**
 * Read tweets
 */

import Twitter from "twitter-lite";
import { User, Tweet, sequelize } from "./database";
// import asyncForEach from "./utilities";

const newClient: Twitter = require("./utilities").newClient();

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

          User.findCreateFind({
            where: {
              id: status.user.id,
            },
            defaults: status.user,
          });

          status.userId = status.user.id;
          status.geocode = geocode;
          status.coordinates = JSON.stringify(status.coordinates);
          status.geo = JSON.stringify(status.geo);

          Tweet.findCreateFind({
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

// asyncForEach()

/**
 * Read tweets
 */

import Twitter from "twitter-lite";
import { User, Tweet, sequelize } from "./database";

const newClient: Twitter = require("./utilities").newClient();

newClient
  .get("search/tweets", {
    q: "earthquake",
    count: 100,
    tweet_mode: "extended",
    // max_results: 9999999
    geocode: "-37.813,144.963,1500km",
    // geocode: "37.781157 -122.398720 1mi"
  })
  .then((results) => {
    // console.log("results", results);
    results.statuses.forEach((status) => {
      // console.log(status);

      User.findCreateFind({
        where: {
          id: status.user.id,
        },
        defaults: status.user,
      });

      // Tweet.colu

      status.userId = status.user.id;
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

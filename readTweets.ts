/**
 * Read tweets
 */

import Twitter from "twitter-lite";
import { User, Tweet } from "./database";
// import asyncForEach from "./utilities";

const newClient: Twitter = require("./utilities").newClient();

for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    // const geocode = `-37.${i},144.${j},10km`; // Melbourne cbd?
    const geocode = `-3${i}.5,14${j}.5,100km`; // regional vic
    // const geocode = `-33.${i}5,151.${j}5,10km`; // sydney cbd

    // const geocode = `-3${i}.5,15${j}.5,100km`; // regional nsw

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
              id: status.user.id_str,
            },
            defaults: status.user,
          });

          status.userId = status.user.id_str;
          status.geocode = geocode;
          status.coordinates = JSON.stringify(status.coordinates);
          status.geo = JSON.stringify(status.geo);

          Tweet.findCreateFind({
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
        process.exit(1)
      });
  }
}


    // earthquakeTweets: function(res, req, db) {
    //   Promise.all([
    //     User.findAll(),
    //     Tweet.findAll({
    //       // limit: 100,
    //       order: [
    //         ['created_at', 'ASC']
    //       ],
    //       group: 'id_str'
    //     }),
    //     Tweet.findAll({
    //       attributes: ['id_str', 'geocode']
    //     })
    //   ]).then(([user, tweet, geocodes]) => {
    //     res.end(JSON.stringify({
    //       users: user.reduce((acc, val) => {
    //         acc[val.id_str] = val
    //         return acc
    //       }, {}),
    //       // tweets: tweet.reduce((acc, val) => {
    //       //   acc[val.id_str] = val
    //       //   return acc
    //       // }, {}),
    //       tweets: tweet,
    //       geocodes: geocodes.reduce((acc, val) => {
    //         if(acc[val.id_str]) {
    //           acc[val.id_str].push(val.geocode)
    //         } else {
    //           acc[val.id_str] = [val.geocode]
    //         }
    //         return acc
    //       }, {}),
    //     }))
    //   })
    // },

// asyncForEach()

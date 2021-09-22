import { User, Tweet, sequelize } from "./database";

Tweet.findAll().then((results) => {
  // console.log(result)
  results.forEach((result: any) => {
    console.log(result.dataValues);
    // console.log(typeof result.dataValues.user)
  });
});

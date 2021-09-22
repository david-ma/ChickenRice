"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
database_1.Tweet.findAll().then((results) => {
    results.forEach((result) => {
        console.log(result.dataValues);
    });
});

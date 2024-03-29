"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Tweet = exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: `${__dirname}/database.sqlite`,
    logging: false,
});
exports.sequelize = sequelize;
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: sequelize_1.DataTypes.BIGINT,
    id_str: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
    name: sequelize_1.DataTypes.STRING,
    screen_name: sequelize_1.DataTypes.STRING,
    location: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
    url: sequelize_1.DataTypes.STRING,
    protected: sequelize_1.DataTypes.BOOLEAN,
    followers_count: sequelize_1.DataTypes.BIGINT,
    friends_count: sequelize_1.DataTypes.BIGINT,
    listed_count: sequelize_1.DataTypes.BIGINT,
    created_at: sequelize_1.DataTypes.DATE,
    favourites_count: sequelize_1.DataTypes.BIGINT,
    geo_enabled: sequelize_1.DataTypes.BOOLEAN,
    verified: sequelize_1.DataTypes.BOOLEAN,
    statuses_count: sequelize_1.DataTypes.BIGINT,
    profile_background_color: sequelize_1.DataTypes.STRING,
    profile_background_image_url_https: sequelize_1.DataTypes.STRING,
    profile_background_tile: sequelize_1.DataTypes.BOOLEAN,
    profile_image_url_https: sequelize_1.DataTypes.STRING,
    profile_banner_url: sequelize_1.DataTypes.STRING,
    profile_link_color: sequelize_1.DataTypes.STRING,
    profile_sidebar_border_color: sequelize_1.DataTypes.STRING,
    profile_sidebar_fill_color: sequelize_1.DataTypes.STRING,
    profile_text_color: sequelize_1.DataTypes.STRING,
    profile_use_background_image: sequelize_1.DataTypes.BOOLEAN,
    has_extended_profile: sequelize_1.DataTypes.BOOLEAN,
    default_profile: sequelize_1.DataTypes.BOOLEAN,
    default_profile_image: sequelize_1.DataTypes.BOOLEAN,
    following: sequelize_1.DataTypes.BOOLEAN,
    follow_request_sent: sequelize_1.DataTypes.BOOLEAN,
}, { sequelize, modelName: "user" });
class Tweet extends sequelize_1.Model {
}
exports.Tweet = Tweet;
Tweet.init({
    created_at: sequelize_1.DataTypes.DATE,
    id: sequelize_1.DataTypes.BIGINT,
    geocode: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
    id_str: { type: sequelize_1.DataTypes.STRING, primaryKey: true },
    full_text: sequelize_1.DataTypes.STRING(280),
    truncated: sequelize_1.DataTypes.BOOLEAN,
    source: sequelize_1.DataTypes.STRING,
    in_reply_to_status_id_str: sequelize_1.DataTypes.STRING,
    in_reply_to_user_id_str: sequelize_1.DataTypes.STRING,
    in_reply_to_screen_name: sequelize_1.DataTypes.STRING,
    geo: sequelize_1.DataTypes.STRING(1000),
    coordinates: sequelize_1.DataTypes.STRING,
    contributors: sequelize_1.DataTypes.STRING,
    is_quote_status: sequelize_1.DataTypes.BOOLEAN,
    retweet_count: sequelize_1.DataTypes.BIGINT,
    favorite_count: sequelize_1.DataTypes.BIGINT,
    favorited: sequelize_1.DataTypes.BOOLEAN,
    retweeted: sequelize_1.DataTypes.BOOLEAN,
    userId: sequelize_1.DataTypes.STRING,
}, { sequelize, modelName: "tweet" });
(async () => {
    await sequelize.sync();
})();

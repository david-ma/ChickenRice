import { Sequelize, Model, DataTypes } from "sequelize";

// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${__dirname}/database.sqlite`,
  logging: false,
});

class User extends Model {}
User.init(
  {
    id: { type: DataTypes.NUMBER, primaryKey: true },
    id_str: DataTypes.STRING,
    name: DataTypes.STRING,
    screen_name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    // entities: DataTypes.STRING,
    protected: DataTypes.BOOLEAN,
    followers_count: DataTypes.NUMBER,
    friends_count: DataTypes.NUMBER,
    listed_count: DataTypes.NUMBER,
    created_at: DataTypes.DATE,
    favourites_count: DataTypes.NUMBER,
    utc_offset: DataTypes.STRING,
    time_zone: DataTypes.STRING,
    geo_enabled: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    statuses_count: DataTypes.NUMBER,
    lang: DataTypes.STRING,
    contributors_enabled: DataTypes.BOOLEAN,
    is_translator: DataTypes.BOOLEAN,
    is_translation_enabled: DataTypes.BOOLEAN,
    profile_background_color: DataTypes.STRING,
    profile_background_image_url: DataTypes.STRING,
    profile_background_image_url_https: DataTypes.STRING,
    profile_background_tile: DataTypes.BOOLEAN,
    profile_image_url: DataTypes.STRING,
    profile_image_url_https: DataTypes.STRING,
    profile_banner_url: DataTypes.STRING,
    profile_link_color: DataTypes.STRING,
    profile_sidebar_border_color: DataTypes.STRING,
    profile_sidebar_fill_color: DataTypes.STRING,
    profile_text_color: DataTypes.STRING,
    profile_use_background_image: DataTypes.BOOLEAN,
    has_extended_profile: DataTypes.BOOLEAN,
    default_profile: DataTypes.BOOLEAN,
    default_profile_image: DataTypes.BOOLEAN,
    following: DataTypes.BOOLEAN,
    follow_request_sent: DataTypes.BOOLEAN,
    notifications: DataTypes.BOOLEAN,
    translator_type: DataTypes.STRING,
    // withheld_in_countries: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
).sync({ alter: true });

class Tweet extends Model {}
Tweet.init(
  {
    created_at: DataTypes.DATE,
    id: { type: DataTypes.NUMBER, primaryKey: true },
    id_str: DataTypes.STRING,
    full_text: DataTypes.STRING(280),
    truncated: DataTypes.BOOLEAN,
    // display_text_range: DataTypes.STRING,
    // entities: DataTypes.STRING,
    // metadata: DataTypes.STRING,
    source: DataTypes.STRING,
    in_reply_to_status_id: DataTypes.STRING,
    in_reply_to_status_id_str: DataTypes.STRING,
    in_reply_to_user_id: DataTypes.STRING,
    in_reply_to_user_id_str: DataTypes.STRING,
    in_reply_to_screen_name: DataTypes.STRING,
    geo: DataTypes.STRING,
    coordinates: DataTypes.STRING,
    // place: DataTypes.STRING,
    contributors: DataTypes.STRING,
    is_quote_status: DataTypes.STRING,
    retweet_count: DataTypes.STRING,
    favorite_count: DataTypes.STRING,
    favorited: DataTypes.STRING,
    retweeted: DataTypes.STRING,
    userId: DataTypes.NUMBER,
  },
  { sequelize, modelName: "tweet" }
).sync({ alter: true });

// Tweet.hasOne(User);

(async () => {
  await sequelize.sync();
  // User.belongsTo(Tweet)

  // Tweet


//   // const jane = await User.create({
//   //   username: "janedoe",
//   //   birthday: new Date(1980, 6, 20),
//   // });
//   // console.log(jane.toJSON());
})();

export { User, Tweet, sequelize };

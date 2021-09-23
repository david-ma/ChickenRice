import { Sequelize, Model, DataTypes } from "sequelize";

// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${__dirname}/database.sqlite`,
  logging: false,
});

class User extends Model {
  id_str: string;
}
User.init(
  {
    id: DataTypes.BIGINT,
    id_str: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING,
    screen_name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    // entities: DataTypes.STRING,
    protected: DataTypes.BOOLEAN,
    followers_count: DataTypes.BIGINT,
    friends_count: DataTypes.BIGINT,
    listed_count: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
    favourites_count: DataTypes.BIGINT,
    // utc_offset: DataTypes.STRING,
    // time_zone: DataTypes.STRING,
    geo_enabled: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    statuses_count: DataTypes.BIGINT,
    // lang: DataTypes.STRING,
    // contributors_enabled: DataTypes.BOOLEAN,
    // is_translator: DataTypes.BOOLEAN,
    // is_translation_enabled: DataTypes.BOOLEAN,
    profile_background_color: DataTypes.STRING,
    // profile_background_image_url: DataTypes.STRING,
    profile_background_image_url_https: DataTypes.STRING,
    profile_background_tile: DataTypes.BOOLEAN,
    // profile_image_url: DataTypes.STRING,
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
    // notifications: DataTypes.BOOLEAN,
    // translator_type: DataTypes.STRING,
    // withheld_in_countries: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
// .sync({ alter: true });

class Tweet extends Model {
  id_str: string;
  geocode: string;
}
Tweet.init(
  {
    created_at: DataTypes.DATE,
    id: DataTypes.BIGINT,
    geocode: { type: DataTypes.STRING, primaryKey: true },
    id_str: { type: DataTypes.STRING, primaryKey: true },
    full_text: DataTypes.STRING(280),
    truncated: DataTypes.BOOLEAN,
    // display_text_range: DataTypes.STRING,
    // entities: DataTypes.STRING,
    // metadata: DataTypes.STRING,
    source: DataTypes.STRING,
    // in_reply_to_status_id: DataTypes.STRING,
    in_reply_to_status_id_str: DataTypes.STRING,
    // in_reply_to_user_id: DataTypes.STRING,
    in_reply_to_user_id_str: DataTypes.STRING,
    in_reply_to_screen_name: DataTypes.STRING,
    geo: DataTypes.STRING(1000),
    coordinates: DataTypes.STRING,
    // place: DataTypes.STRING,
    contributors: DataTypes.STRING,
    is_quote_status: DataTypes.BOOLEAN,
    retweet_count: DataTypes.BIGINT,
    favorite_count: DataTypes.BIGINT,
    favorited: DataTypes.BOOLEAN,
    retweeted: DataTypes.BOOLEAN,
    userId: DataTypes.STRING,
  },
  { sequelize, modelName: "tweet" }
);
// .sync({ alter: true });

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

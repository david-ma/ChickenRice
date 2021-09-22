#!/usr/local/bin/node

/**
 * Chicken Rice App!
 *
 * This is a collab by David Ma & Grace Tang
 * We're making an app that will post a picture of Chicken Rice every day
 *
 * To do this, we need to:
 * - have a folder filled with chicken rice images,
 * - connect to twitter
 * - pick an image and post it
 * - remember which images have already been posted. Move to new folder?
 *
 *
 * Stretch goals:
 * - Allow us to choose which image gets posted next?
 * - Meta data? Links to where the image was found/by who?
 * - Allow other people to submit images of chicken rice?
 * - Maybe make a separate webpage for people to submit files, include introductions and about sections?
 *
 **/

import { newClient } from "./utilities";

require("dotenv").config({
  path: `${__dirname}/.env`,
});

const fs = require("fs");

const fresh_images = `${__dirname}/fresh_images/`;
const posted_images = `${__dirname}/posted_images/`;
const user_images = `${__dirname}/user_photos_approved/`;

var promises = [
  fs.promises.readdir(fresh_images),
  fs.promises.readdir(posted_images),
  fs.promises.readdir(user_images),
];

Promise.all(promises).then(function ([
  new_images,
  old_images,
  submitted_images,
]) {
  new_images = ignoreSystemFiles(new_images);
  old_images = ignoreSystemFiles(old_images);
  submitted_images = ignoreSystemFiles(submitted_images);

  if (submitted_images.length > 0) {
    var image = submitted_images[0];
    console.log(
      `We have user submitted images, so let's post this instead: "${image}"`
    );

    // To do: error handling for this assumption?
    var username = image.split(" - ")[0];
    var status = `Today's chicken rice photo is brought to you by our friend ${username} 📸 Eat well!`;

    postChickenRice(user_images, image, status, DMLowOnImages);
  } else if (new_images.length > 0) {
    // Easy way, just use the next image:
    var nextImage = new_images[0];

    var statuses = [
      "Today's serving of chicken rice",
      "Here's your chicken rice of the day",
      "It's chimkem rice tiem :3",
      "One serving of chicken rice, coming right up.",
    ];

    var orderedStatus = statuses[old_images.length % statuses.length];
    var randomStatus = selectRandom(statuses);

    console.log(
      `Posting this image: ${nextImage} with this status: ${orderedStatus}`
    );
    postChickenRice(fresh_images, nextImage, orderedStatus, DMLowOnImages);
  } else {
    // Oh no, no images to post.
    // Maybe do something else instead?
    // Post applogy message?
    // David and Grace's twitter accounts: [ 72238031, 219920424 ]
    const dm_targets = [72238031, 219920424];

    dm_targets.forEach(function (target) {
      newClient()
        .post("direct_messages/events/new", {
          event: {
            type: "message_create",
            message_create: {
              target: {
                recipient_id: target,
              },
              message_data: {
                text: `Failed to post! No images left!`,
              },
            },
          },
        })
        .then((results) => {
          console.log("DM sent:", results);
        })
        .catch((error) => {
          console.log("Error sending DM", error);
        });
    });
  }

  function DMLowOnImages() {
    // Also, DM on twitter if less than 5 images left
    if (new_images.length + submitted_images.length < 5) {
      var number_of_images_left = new_images.length + submitted_images.length;

      // David and Grace's twitter accounts: [ 72238031, 219920424 ]
      const dm_targets = [72238031, 219920424];

      dm_targets.forEach(function (target) {
        newClient()
          .post("direct_messages/events/new", {
            event: {
              type: "message_create",
              message_create: {
                target: {
                  recipient_id: target,
                },
                message_data: {
                  text: `We're running out of Chicken Rice images. Oh no! ${number_of_images_left} images left`,
                },
              },
            },
          })
          .then((results) => {
            console.log("DM sent:", results);
          })
          .catch((error) => {
            console.log("Error sending DM", error);
          });
      });
    }
  }
});

/**
 * Post an image & status to twitter!
 */
function postChickenRice(
  folder,
  image_filename,
  status = `Today's serving of chicken rice`,
  callback
) {
  var image_data = fs.readFileSync(`${folder}/${image_filename}`, {
    encoding: "base64",
  });

  // Upload the image
  newClient("upload")
    .post("media/upload", {
      media_data: image_data,
      status: status,
    })
    .then((results) => {
      // Once the image has been uploaded, post the status, with the image
      newClient()
        .post("statuses/update", {
          status: status,
          media_ids: [results.media_id_string], // include the image "media id string" here
        })
        .then((result) => {
          console.log("Successfully posted on Twitter!");
          console.log(result);

          // Move image from "new images" to "old images" after using it
          // Only move image, if image was successfully posted.
          fs.rename(
            `${folder}/${image_filename}`,
            `${posted_images}/${image_filename}`,
            console.error
          );

          callback(); // DM us when it's good
        })
        .catch((err) => console.log(err));
    })
    .catch(console.error);
}

/**
 * Returns a random thing from an array
 */
function selectRandom(array) {
  const length = array.length;
  return array[Math.floor(Math.random() * length)];
}

/**
 * Ignores strings that start with . in an array
 */
function ignoreSystemFiles(array) {
  var newArray = [];
  array.forEach(function (thing) {
    if (thing.slice(0, 1) != ".") {
      newArray.push(thing);
    }
  });
  return newArray;
}

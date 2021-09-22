#!/usr/local/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
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
Promise.all(promises).then(function ([new_images, old_images, submitted_images,]) {
    new_images = ignoreSystemFiles(new_images);
    old_images = ignoreSystemFiles(old_images);
    submitted_images = ignoreSystemFiles(submitted_images);
    if (submitted_images.length > 0) {
        var image = submitted_images[0];
        console.log(`We have user submitted images, so let's post this instead: "${image}"`);
        var username = image.split(" - ")[0];
        var status = `Today's chicken rice photo is brought to you by our friend ${username} 📸 Eat well!`;
        postChickenRice(user_images, image, status, DMLowOnImages);
    }
    else if (new_images.length > 0) {
        var nextImage = new_images[0];
        var statuses = [
            "Today's serving of chicken rice",
            "Here's your chicken rice of the day",
            "It's chimkem rice tiem :3",
            "One serving of chicken rice, coming right up.",
        ];
        var orderedStatus = statuses[old_images.length % statuses.length];
        var randomStatus = selectRandom(statuses);
        console.log(`Posting this image: ${nextImage} with this status: ${orderedStatus}`);
        postChickenRice(fresh_images, nextImage, orderedStatus, DMLowOnImages);
    }
    else {
        const dm_targets = [72238031, 219920424];
        dm_targets.forEach(function (target) {
            utilities_1.newClient()
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
        if (new_images.length + submitted_images.length < 5) {
            var number_of_images_left = new_images.length + submitted_images.length;
            const dm_targets = [72238031, 219920424];
            dm_targets.forEach(function (target) {
                utilities_1.newClient()
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
function postChickenRice(folder, image_filename, status = `Today's serving of chicken rice`, callback) {
    var image_data = fs.readFileSync(`${folder}/${image_filename}`, {
        encoding: "base64",
    });
    utilities_1.newClient("upload")
        .post("media/upload", {
        media_data: image_data,
        status: status,
    })
        .then((results) => {
        utilities_1.newClient()
            .post("statuses/update", {
            status: status,
            media_ids: [results.media_id_string],
        })
            .then((result) => {
            console.log("Successfully posted on Twitter!");
            console.log(result);
            fs.rename(`${folder}/${image_filename}`, `${posted_images}/${image_filename}`, console.error);
            callback();
        })
            .catch((err) => console.log(err));
    })
        .catch(console.error);
}
function selectRandom(array) {
    const length = array.length;
    return array[Math.floor(Math.random() * length)];
}
function ignoreSystemFiles(array) {
    var newArray = [];
    array.forEach(function (thing) {
        if (thing.slice(0, 1) != ".") {
            newArray.push(thing);
        }
    });
    return newArray;
}

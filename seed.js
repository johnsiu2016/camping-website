var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
    name: "Green",
    image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
    desc: "It is green"
}, {
    name: "Sky",
    image: "https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",
    desc: "The sky is blue"
}, {
    name: "Car",
    image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
    desc: "There is a car"
}];

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Removed all campgrounds");
            Comment.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Removed all comments");
                    data.forEach(function(x) {
                        Campground.create(x, function(err, campground) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Created a new campground");
                                Comment.create({
                                    text: "This place is great, but I wish there was internet",
                                    author: "John"
                                }, function(err, comment) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("Created a new comment");
                                        campground.comments.push(comment);
                                        campground.save();
                                    }
                                });
                            }
                        });
                    });
                }
            });

        }
    });
}

module.exports = seedDB;

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("Error: something went wrong when showing allCampgrounds");
        } else {
            res.render("campgrounds/index", {arr: allCampgrounds});  
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new"); 
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, desc: desc, author: author};
    Campground.create(newCampground, function(err, newCampground) {
        if (err) {
            console.log("Error: something went wrong when creating newCampground");
        } else {
            console.log(newCampground + "has been added to the database");
            req.flash("success", "Successfully added campground");
            res.redirect("/campgrounds");
        }
    });
});

//SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {foundCampground: foundCampground});    
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
       if (err) {
           console.log(err);
       } else {
           res.render("campgrounds/edit", {foundCampground: foundCampground});
       }
   });
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
       if (err) {
           console.log(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground) {
       if (err) {
           console.log(err);
       } else {
           req.flash("success", "Successfully deleted campground");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;
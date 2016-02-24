var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});

//CREATE
router.post("/",  middleware.isLoggedIn, function(req, res) {
    Comment.create(req.body.comment, function(err, comment) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            Campground.findById(req.params.id, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });

        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
   Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
           console.log(err);
       } else {
           res.render("comments/edit", {foundComment: foundComment, campground_id: req.params.id});
       }
   });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
       if (err) {
           console.log(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
       if (err) {
           console.log(err);
       } else {
           req.flash("success", "Successfully deleted comment");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

module.exports = router;
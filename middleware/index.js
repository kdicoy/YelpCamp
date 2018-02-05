var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

var middlewareObject = {};

// Checks if the user owns the campground to be editted/deleted
middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    //Check if user is logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               req.flash("error", "Campground not found!");
               console.log(err);
               res.redirect("back");
           } else {
               if(foundCampground.author.id.equals(req.user._id)) {
                    next();
               } else {
                   req.flash("error", "Permission Denied!");
                   res.redirect("back");
               }
           }
        });
        
    } else {
        req.flash("error", "You need to be logged in!")
        res.redirect("back");
    }
}

// Checks if the user owns the comment to be editted/deleted
middlewareObject.checkCommentOwnership = function(req, res, next) {
    //Check if user is logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               req.flash("error", "Error: Unknown action");
               console.log(err);
               res.redirect("back");
           } else {
               // Does the user own the comment?
               if(foundComment.author.id.equals(req.user._id)) {
                    next();
               } else {
                   req.flash("error", "Permission Denied!");
                   res.redirect("back");
               }
           }
        });
        
    } else {
        req.flash("error", "You need to be logged in!")
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req, res, next) {
     if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in!");
    res.redirect("/login");
}

module.exports = middlewareObject;
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment")
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new.ejs", {campground: foundCampground});
       }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           req.flash("error", "Something went wrong!");
           console.log(err);
       } else {
           //create new comment
           Comment.create(req.body.comment, function(err, comment) {
               if(err) {
                   console.log(err);
               } else {
                 // add user and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save();
                 //connect new comment to campground
                 campground.comments.push(comment._id);   
                 campground.save();
                 //redirect to show page
                 req.flash("success", "Comment was successfully created!");
                 res.redirect("/campgrounds/" + campground._id);
               }
           })
       }
   });

});

// EDIT COMMENT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req, res) {
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
          console.log(err);
      } else {
          res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment}); 
      }
   });
});

// PUT COMMENTS ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upfateComment) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if(err) {
           console.log(err);
       } else {
            res.redirect("/campgrounds/" + req.params.id);
       }
       
   });
   
   
});


module.exports = router;
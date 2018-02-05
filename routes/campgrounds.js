var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// Gets All The Available Campgrounds
router.get("/", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
       if(err) {
           console.log(err);
       } else {
           res.render("campgrounds/index.ejs", {camps: campgrounds})
       }
    });
});

//CREATE ROUTE (Create a new campground)
router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id, 
        username: req.user.username
    };
    var newCamp = {name: name, image: image, description: desc, author: author, price: price};
    
    //Create a new campground and save to database
    Campground.create(newCamp, function(err, newCamp) {
       if(err) {
           console.log(err);
       } else {
            //redirect back to campground 
            res.redirect("/campgrounds");
       }
    });

});

//NEW ROUTE (Shows the form to add new campgrounds)
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new.ejs"); 
});

//SHOW ROUTE (Shows more information about the campground)
router.get("/:id", function(req, res) {
    //find the campground with the ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if(err) {
           console.log("THERES AN ERROR");
       } else {
           
           res.render("campgrounds/show.ejs", {campground: foundCampground});
       }
    });
});

// EDIT CAMPGROUND ROUTE 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               console.log(err);
           } else {
               res.render("campgrounds/edit.ejs", {campground: foundCampground});
           }
        });

});

// PUT CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if(err) {
          console.log(err);
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})



module.exports = router;
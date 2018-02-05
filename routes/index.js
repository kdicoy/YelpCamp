var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res) {
   res.render("landing.ejs"); 
});


//Show register form
router.get("/register", function(req, res) {
    res.render("register.ejs");
});

// Handle Sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    var pass = req.body.password;
    
    User.register(newUser, pass, function(err, user) {
       if(err) {
           req.flash("error", err.message);
           return res.redirect("back");
       } 
       
       passport.authenticate("local")(req, res, function() {
           req.flash("success", "Welcome to YelpCamp! " + user.username);
           res.redirect("/campgrounds");
       });
    });
});

// Show Login Form
router.get("/login", function(req,res) {
   res.render("login.ejs"); 
});

// Handle Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout handler
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
});



module.exports = router;
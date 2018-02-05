var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local")
var methodOverride = require("method-override");
var flash = require("connect-flash");

// Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var User = require("./models/user.js");
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comment.js");
var seedDB = require("./seeds.js");

app.use(express.static(__dirname + "/public"));

//seedDB();



mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://admin:pogi1234@ds125048.mlab.com:25048/yelpcamp");

process.env.databaseURL

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "SESSION INITIALIZED",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


// Start the server
app.listen(process.env.PORT, process.env.IP, function() {
    
    console.log("YelpCamp Server has started!!");
});

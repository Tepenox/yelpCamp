var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var expressSession = require("express-session");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

//requirng routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");



mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;// pass this variable to all the route 
    next(); //it s acts like a middlewar to all so we should call next bafter it
});
// seedDB();
Comment.remove({}, function (err, data) {
    if (err) {
        console.log("error removing comments");
    } else {
        console.log("removed all comments");
    }
})
//passport confugiration
app.use(expressSession({
    secret: "a password encryption this can be anything we want",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // user.function() comes with passport-loca-mongoose
passport.serializeUser(User.serializeUser());// user.function() comes with passport-loca-mongoose
passport.deserializeUser(User.deserializeUser());// user.function() comes with passport-loca-mongoose


//this has to be after the passport confugiration i learned that the hard way
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;// pass this variable to all the route 
    next(); //it s acts like a middlewar to all so we should call next bafter it
});


app.use("/", indexRoutes); //nothing commun between them
app.use("/campgrounds", campgroundRoutes); // go to campgrounds routes and append /campground to routes so /campground <==>  /
app.use("/campgrounds/:id/comments", commentRoutes); // in ordder to :id to be passed in you need to use {mergeParams :true} as an option inside comments.js routes file



app.listen(3000, function () {
    console.log("Yelp Camp Server Is Up And Running...");

})
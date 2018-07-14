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


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;// pass this variable to all the route 
    next(); //it s acts like a middlewar to all so we should call next bafter it
});

seedDB();

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




app.get("/", function (req, res) {
    res.render("landing");
});


//==========
//CAMPGROUND ROUTES
//==========

//INDEX

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);

        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
            // console.log("from get route " + req.user);

        }

    })


})
//NEW
app.get("/campgrounds/new", function (req, res) { //be carefull here the SHOW route will be triguered first if we did putit above tis one so it s a good thing to keep it here
    res.render("campgrounds/new");

})
//CREAT
app.post("/campgrounds", function (req, res) {
    var newCampground = req.body.campground;

    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);

        } else {
            res.redirect("/campgrounds");
        }
    })

})

//SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) { //you find the campground by id then you populate it with comments so u can display them them  
        if (err) {
            res.redirect("/");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
})

//=============
//COMMENTS ROUTES
//=============

//NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {

        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    })
})

//CREAT

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(comment); // foundCampground and not Campground
                    foundCampground.save(); // important one i always forget it  :p
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
})

//========
// AUTH ROUTES
//========

//register routes

app.get("/register", function (req, res) {
    res.render("register")
})

app.post("/register", function (req, res) {
    var newUser = { username: req.body.username }
    User.register(newUser, req.body.password, function (err, user) {

        if (err) {
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    }); //provided by passport -local-mongoose 
})

//login routes

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    //a callback function
})

//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



app.listen(3000, function () {
    console.log("server is up and running");

})
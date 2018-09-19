//INDEX IS FOR ALL ROUTES NOT RELATED TO MODELES

var express = require("express");
var router = express.Router(); //new instance of the express router 
var passport = require("passport");
var User = require("../models/user")


router.get("/", function (req, res) {
    res.render("landing");
});
//========
// AUTH ROUTES
//========

//register routes

router.get("/register", function (req, res) {
    res.render("register")
})

router.post("/register", function (req, res) {
    var newUser = { username: req.body.username }
    // eval(require("locus")); // locus let s you stop the code and evaluate it 
    User.register(newUser, req.body.password, function (err, user) {

        if (err) {
            console.log(err);
            req.flash("error", err.message)// err rather than passing a string
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to YelpCamp " + user.username)
                res.redirect("/campgrounds");
            })
        }
    }); //provided by passport -local-mongoose 
})

//login routes

router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", function (req, res, next) {

    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true, // pass the error message to the flash automaticly u can use a custom one
        successFlash: "Welcome Back, " + req.body.username + " !"
    })(req, res);
});

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("warning", "Logged you out!");
    res.redirect("/campgrounds");
})

module.exports = router;


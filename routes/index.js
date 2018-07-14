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

router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    //a callback function
})

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
})



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;


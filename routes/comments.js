var express = require("express");
var router = express.Router({ mergeParams: true }); //new instance of the express router  merge params so we can pass :ID param throu the routes or unless it s will be null on the comments routes
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//=============
//COMMENTS ROUTES
//=============

//NEW
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {

        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    })
})

//CREAT

router.post("/", isLoggedIn, function (req, res) {
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

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router ;
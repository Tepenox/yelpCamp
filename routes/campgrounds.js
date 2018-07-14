var express = require("express");
var router = express.Router(); //new instance of the express router 
var Campground = require("../models/campground");

//==========
//CAMPGROUND ROUTES
//==========

//INDEX

router.get("/", function (req, res) {
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
router.get("/new", function (req, res) { //be carefull here the SHOW route will be triguered first if we did putit above tis one so it s a good thing to keep it here
    res.render("campgrounds/new");

})
//CREAT
router.post("/", function (req, res) {
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
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) { //you find the campground by id then you populate it with comments so u can display them them  
        if (err) {
            res.redirect("/");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
})

module.exports = router;
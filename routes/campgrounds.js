var express = require("express");
var router = express.Router(); //new instance of the express router 
var Campground = require("../models/campground");

//==========
//CAMPGROUND ROUTES
//==========

//EDIT
router.get("/:id/edit", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    })

})


//UPDATE
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})







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
router.get("/new", isLoggedIn, function (req, res) { //be carefull here the SHOW route will be triguered first if we did putit above tis one so it s a good thing to keep it here
    res.render("campgrounds/new");

})
//CREAT
router.post("/", isLoggedIn, function (req, res) {
    Campground.create(req.body.campground, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            newCampground.author.id = req.user.id;
            newCampground.author.username = req.user.username;
            newCampground.save();
            console.log("the new campgroud is" + newCampground);
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
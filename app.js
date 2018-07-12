var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

seedDB();



app.get("/", function (req, res) {
    res.render("landing");
});
//INDEX
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);

        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
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
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
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
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {

        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    })
})

//CREAT

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment , function(err,comment){
                if (err) {
                    console.log(err);
                }else{
                    foundCampground.comments.push(comment); // foundCampground and not Campground
                    foundCampground.save(); // important one i always forget it  :p
                    res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
})


app.listen(3000, function () {
    console.log("server is up and running");

})
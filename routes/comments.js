var express = require("express");
var router = express.Router({ mergeParams: true }); //new instance of the express router  merge params so we can pass :ID param throu the routes or unless it s will be null on the comments routes
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware") //if we require a directory it will authomaticly require index file inside that directory


//=============
//COMMENTS ROUTES
//=============

//NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {

        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    })
})

//CREAT

router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save(); //after setting some propreties u have to save it
                    foundCampground.comments.push(comment); // foundCampground and not Campground
                    foundCampground.save(); // important one i always forget it  :p
                    console.log(comment);
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
})


//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function (req, res) { //if we wrote id it will override the previous campground id
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }

    })
});

//UPDATE

router.put("/:comment_id", middleware.checkCommentOwnerShip, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }

    })
})

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
            console.log("a err while trying to delete a comment");

        } else {
            res.redirect("/campgrounds/" + req.params.id) //campground.id 
        }
    })
})









module.exports = router;
//all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");




var middlewareObj = {};

middlewareObj.checkCampgroundOwnerShip = function (req, res, next) {
    //is the userlogged in ?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not Found");
                res.redirect("back");
            } else {
                // does the usrerown the campground ??

                //foundCampground.author.id is a mongoose object
                // req.user.id is a string
                if (foundCampground.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "you don't have permession to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in First!");        
        res.redirect("back"); //return the user to the previous page they were in
    }
}




middlewareObj.checkCommentOwnerShip = function (req, res, next) {
    //is the userlogged in ?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does the usrerown the Comment ??

                //foundComment.author.id is a mongoose object
                // req.user.id is a string
                if (foundComment.author.id.equals(req.user.id)) { //thta s why we use equals here
                    next();
                } else {
                    req.flash("error","you don't have permession to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in First!");        
        res.redirect("back"); //return the user to the previous page they were in
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in First!");//adding this line won t display anything imediatly untill the  next page and we HACE TO put it before we redirect....it s one time thing
    res.redirect("/login"); 
}


module.exports = middlewareObj;

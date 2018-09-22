var express = require("express");
var router = express.Router(); //new instance of the express router 
var Campground = require("../models/campground");
var middleware = require("../middleware") //if we require a directory it will authomaticly require index file inside that directory
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname); // we setting up here how the file name is gonne be like when it s get uploaded
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'df3cykxrp',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
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
router.get("/new", middleware.isLoggedIn, function (req, res) { //be carefull here the SHOW route will be triguered first if we did putit above tis one so it s a good thing to keep it here
    res.render("campgrounds/new");

})
//CREAT
router.post("/", middleware.isLoggedIn, upload.single("image"), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        console.log(result.secure_url);
        console.log(req.body.campground);

        Campground.create(req.body.campground, function (err, newCampground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {

                newCampground.author.id = req.user.id;
                newCampground.author.username = req.user.username;
                newCampground.save();
                res.redirect("/campgrounds");
            }
        })
    })
})

//SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) { //you find the campground by id (without populate only the id of comments exists inside the CAmpground obejct ) then you populate it with comments so u can display them them

        if (err) {
            res.redirect("/");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
})


//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});


//UPDATE
router.put("/:id", middleware.checkCampgroundOwnerShip, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Changes has been saved");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})


//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnerShip, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
            console.log("error deleting campground");

        } else {
            req.flash("warning", "Commment deleted")
            res.redirect("/campgrounds")
        }
    })
})





module.exports = router;
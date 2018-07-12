var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({

    name: String,
    image: String

});
var Campground = mongoose.model("campground", campgroundSchema);

//too add a campground to db for testing reasons

// Campground.create({ name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg" }, function (err,campground) {
//     if (err) {
//         console.log(err);

//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(campground);


//     }
// }
// );


// var campgrounds = [{ name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg" },
// { name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg" },
// { name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg" },
// { name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg" },
// { name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg" },
// { name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg" },
// { name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg" },
// { name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg" },
// { name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg" }
// ];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);

        } else {
            res.render("campgrounds", { campgrounds: allCampgrounds });
        }

    })


})
app.post("/campgrounds", function (req, res) {
    var newCampgroundName = req.body.name;
    var newCampgroundImage = req.body.image;
    var newCampground = { name: newCampgroundName, image: newCampgroundImage }
    Campground.create(newCampground , function(err,newlyCreated){
        if (err) {
            console.log(err);
            
        }else {
            res.redirect("/campgrounds");
        }
    })
    
})

app.get("/campgrounds/new", function (req, res) { //be carefull here the down route will be triguered first if we did putit above tis one so it s a good thing to keep it here
    res.render("new");

})

app.get("/campgrounds/:id",function(req,res){
    res.send("this will be the show page");
})





app.listen(3000, function () {
    console.log("server is up and running");

})
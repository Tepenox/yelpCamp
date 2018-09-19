var mongoose = require("mongoose");
var passportLocalMongoose = require ("passport-local-mongoose");



var UserSchema = new mongoose.Schema({
    username: String,
    password : String
});


UserSchema.plugin(passportLocalMongoose); // add passportLocalMongoose funtions to the UserSchema object

module.exports = mongoose.model("User", UserSchema);
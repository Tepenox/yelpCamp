var mongoose = require("mongoose");
var passportLocalMongoose = require ("passport-local-mongoose");



var UserSchema = new mongoose.Schema({
    username: String,
    password : String,
    isAdmin:{ type:Boolean , default:false }
});


UserSchema.plugin(passportLocalMongoose); // add passportLocalMongoose funtions to the UserSchema object

module.exports = mongoose.model("User", UserSchema);
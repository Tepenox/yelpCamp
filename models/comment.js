var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({

    text: String,
    createdAt: {
        type: Date, default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },// specifying the type of id proprety
        username: String //we gonna nedd user name foseveral time 
    }

});

module.exports = mongoose.model("Comment", commentSchema);
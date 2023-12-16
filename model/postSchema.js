const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    blog_title: {
        type: String,
        required: true
    },
    blog_desc: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    created_on: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_on: {
        type: Date,
        required: true,
        default: Date.now
    },
   
});

const postModel = mongoose.model("Post", schema);
module.exports = postModel;
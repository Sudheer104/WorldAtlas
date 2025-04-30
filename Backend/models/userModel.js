const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please enter a name"]
    },
    email: {
        type: String,
        require: [true, "please enter a email"]
    },
    mobile: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: [true, "please enter a password"]
    },
    is_verified: {
        type: Number,
        default:0//1 for verify
    },
    image: {
        type: String,
        require: true
    },


});

 module.exports = mongoose.model("User",userSchema)
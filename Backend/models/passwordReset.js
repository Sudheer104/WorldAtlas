const mongoose = require('mongoose')


const passwordResetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require:true,
        ref:'User'
    },
    token: {
        type: String,
        require:true
    }
});

module.exports = mongoose.model("PasswordReset",passwordResetSchema);
const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    , refreshToken: {
        type: String,
        required: false
    }, accessToken: {
        type: String,
        required: false
    }
});
const User = module.exports = mongoose.model("User", UserSchema);

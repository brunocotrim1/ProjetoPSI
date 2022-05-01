const mongoose = require("mongoose");
const TeamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});
const Team = module.exports = mongoose.model("Team", TeamSchema);

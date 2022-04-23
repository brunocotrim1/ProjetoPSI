const mongoose = require("mongoose");
const HeroSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    petID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: false
    }
});
const Hero = module.exports = mongoose.model("Hero", HeroSchema);

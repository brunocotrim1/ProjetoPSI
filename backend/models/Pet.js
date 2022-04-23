const mongoose = require("mongoose");
const PetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Pet = module.exports = mongoose.model("Pet", PetSchema);
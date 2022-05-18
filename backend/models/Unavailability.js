const mongoose = require("mongoose");
const UnavailabilitySchema = mongoose.Schema({
    beginDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
});
const Unavailability = module.exports = mongoose.model("Unavailability", UnavailabilitySchema);
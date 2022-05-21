const mongoose = require("mongoose");
const UnavailabilitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    beginDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
});
const Unavailability = module.exports = mongoose.model("Unavailability", UnavailabilitySchema);
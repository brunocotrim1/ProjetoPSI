const mongoose = require("mongoose");
const ReunionSchema = mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    beginDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    possibleTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
});
const Reunion = module.exports = mongoose.model("Reunion", ReunionSchema);

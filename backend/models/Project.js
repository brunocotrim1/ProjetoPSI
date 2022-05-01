const mongoose = require("mongoose");
const ProjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    acronym: {
        type: String,
        required: true,
        required: true
    },
    linkedTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    beginDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
});
const Project = module.exports = mongoose.model("Project", ProjectSchema);

const mongoose = require("mongoose");
const Project = require("./Project");
const TaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    usersAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    progress: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        required: true
    },
    beginDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    linkedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    checklist: {
        type: Map,
        of: String
    }
});
const Task = module.exports = mongoose.model("Task", TaskSchema);

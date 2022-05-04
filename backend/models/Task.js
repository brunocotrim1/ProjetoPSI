const mongoose = require("mongoose");
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
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        required: true
    },
    beginDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
});
const Task = module.exports = mongoose.model("Task", TaskSchema);

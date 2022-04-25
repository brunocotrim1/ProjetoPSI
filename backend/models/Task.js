const mongoose = require("mongoose");
const TaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userAssociated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
const User = module.exports = mongoose.model("Task", TaskSchema);

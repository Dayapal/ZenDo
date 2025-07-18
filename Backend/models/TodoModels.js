const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    todo:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending","in-process", "completed"],
        default: 'pending'
    }

}, {timestamps: true});

const TodoModel = mongoose.model("Todo", todoSchema)

module.exports = TodoModel;
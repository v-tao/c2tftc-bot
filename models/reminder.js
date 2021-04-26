const mongoose = require("mongoose");
const ReminderSchema = new mongoose.Schema({
    userId: String,
    minute: Number,
    hour: Number,
    message: String,
}, {collection: "reminders"});

module.exports = mongoose.model("Reminder", ReminderSchema);
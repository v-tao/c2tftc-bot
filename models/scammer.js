const mongoose = require("mongoose");
const scammerSchema = new mongoose.Schema({
    userId: String,
    serverId: String,
    count: Number,
}, {collection: "scammers"});

module.exports = mongoose.model("Scammer", scammerSchema);
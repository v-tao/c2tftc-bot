const mongoose = require("mongoose");
const loserSchema = new mongoose.Schema({
    userId: String,
    serverId: String,
    count: Number,
}, {collection: "losers"})

module.exports = mongoose.model("Loser", loserSchema)

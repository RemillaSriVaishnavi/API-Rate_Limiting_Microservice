const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true },
  hashedApiKey: String,
  maxRequests: Number,
  windowSeconds: Number
});

module.exports = mongoose.model("Client", clientSchema);
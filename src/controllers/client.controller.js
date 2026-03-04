const Client = require("../models/client.model");
const bcrypt = require("bcryptjs");

exports.registerClient = async (req, res) => {
  try {
    const { clientId, apiKey, maxRequests, windowSeconds } = req.body;

    const exists = await Client.findOne({ clientId });
    if (exists) return res.status(409).send("Client exists");

    const hashedApiKey = await bcrypt.hash(apiKey, 10);

    const client = await Client.create({
      clientId,
      hashedApiKey,
      maxRequests,
      windowSeconds
    });

    res.status(201).json({
      clientId: client.clientId,
      maxRequests: client.maxRequests,
      windowSeconds: client.windowSeconds
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
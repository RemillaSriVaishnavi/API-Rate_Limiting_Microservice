const Client = require("../models/client.model");
const { checkRateLimit } = require("../services/tokenBucket.service");

exports.checkLimit = async (req, res) => {
  const { clientId, path } = req.body;

  const client = await Client.findOne({ clientId });
  if (!client) return res.status(400).send("Invalid client");

  const result = await checkRateLimit(
    clientId,
    path,
    client.maxRequests,
    client.windowSeconds
  );

  if (!result.allowed) {
    res.set("Retry-After", result.retryAfter);
    return res.status(429).json(result);
  }

  res.status(200).json(result);
};
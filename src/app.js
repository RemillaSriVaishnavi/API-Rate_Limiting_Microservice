require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const redis = require("./config/redis.config");

const clientRoutes = require("./routes/client.routes");
const rateRoutes = require("./routes/ratelimit.routes");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/v1", clientRoutes);
app.use("/api/v1", rateRoutes);

app.get("/health", (req, res) => res.send("OK"));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

module.exports = app;
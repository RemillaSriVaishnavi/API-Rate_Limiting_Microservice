const router = require("express").Router();
const { registerClient } = require("../controllers/client.controller");

router.post("/clients", registerClient);

module.exports = router;
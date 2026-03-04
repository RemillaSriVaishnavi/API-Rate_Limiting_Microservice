const router = require("express").Router();
const { checkLimit } = require("../controllers/ratelimit.controller");

router.post("/ratelimit/check", checkLimit);

module.exports = router;
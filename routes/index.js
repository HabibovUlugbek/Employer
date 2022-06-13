const { Router } = require("express");
const router = Router();

router.use("/jobs", require("./jobs"));

module.exports = router;

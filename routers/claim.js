const express = require("express");
const router = express.Router();
const { claim } = require("../controllers/claim");

router.route("/").post(claim);

module.exports = router;

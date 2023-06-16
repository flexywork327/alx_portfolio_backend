const express = require("express");
const router = express.Router();
const { getIndustries } = require("../Controllers/utilsControllers");

router.get("/industries", getIndustries);

module.exports = router;

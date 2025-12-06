const router = require("express").Router();
const { getSalesController } = require("../controllers/sales.controller");

router.get("/", getSalesController);

module.exports = router;

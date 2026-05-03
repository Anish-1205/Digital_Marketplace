const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const { metrics } = require("../controllers/adminController");

router.get("/metrics", protect, authorize("admin"), metrics);

module.exports = router;

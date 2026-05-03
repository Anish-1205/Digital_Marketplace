const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const { metrics, listEntrepreneurs } = require("../controllers/adminController");

router.get("/metrics", protect, authorize("admin"), metrics);
router.get("/entrepreneurs", protect, authorize("admin"), listEntrepreneurs);

module.exports = router;

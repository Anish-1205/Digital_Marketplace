const router = require("express").Router();
const { protect } = require("../middleware/auth");
const controller = require("../controllers/orderController");

router.get("/", protect, controller.getAll);
router.post("/", protect, controller.create);
router.patch("/:id/status", protect, controller.updateStatus);

module.exports = router;

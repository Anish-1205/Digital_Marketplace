const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const controller = require("../controllers/entrepreneurController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", protect, authorize("entrepreneur", "admin"), controller.create);
router.patch("/:id", protect, authorize("entrepreneur", "admin"), controller.update);
router.patch("/:id/approve", protect, authorize("admin"), controller.approve);

module.exports = router;

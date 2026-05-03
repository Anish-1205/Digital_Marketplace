const router = require("express").Router();
const { protect } = require("../middleware/auth");
const controller = require("../controllers/productController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", protect, controller.create);
router.patch("/:id", protect, controller.update);
router.delete("/:id", protect, controller.remove);

module.exports = router;

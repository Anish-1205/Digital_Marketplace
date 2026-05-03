const router = require("express").Router();
const { protect } = require("../middleware/auth");
const controller = require("../controllers/reviewController");

router.get("/", controller.getAll);
router.post("/", protect, controller.create);

module.exports = router;

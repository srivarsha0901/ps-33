const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/signin", authController.login);
// Optional protected route
// router.get("/me", authMiddleware, authController.getUser);

module.exports = router;

const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/verify/:token", authController.verifyEmail);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/theme-preference", authController.updateThemePreference);
router.get("/theme-preference", authController.getThemePreference);

module.exports = router;

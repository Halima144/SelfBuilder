const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getProfile, updateAvatar, updateProfile } = require("../controllers/profileController");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
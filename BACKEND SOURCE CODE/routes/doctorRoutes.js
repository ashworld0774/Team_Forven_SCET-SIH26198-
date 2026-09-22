const express = require("express");
const router = express.Router();
const { getProfile, updateProfilePhoto } = require("../controllers/doctorController");
const { protectDoctor } = require("../middleware/authMiddleware");
const { uploadProfile } = require("../config/cloudinary");

router.get("/profile", protectDoctor, getProfile);
router.put("/profile/photo", protectDoctor, uploadProfile.single("photo"), updateProfilePhoto);

module.exports = router;
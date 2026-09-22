const express = require("express");
const router = express.Router();
const { registerDoctor, loginDoctor, loginAdmin } = require("../controllers/authController");
const { uploadCertificate } = require("../config/cloudinary");

router.post("/register", uploadCertificate.single("certificate"), registerDoctor);
router.post("/login", loginDoctor);
router.post("/admin/login", loginAdmin);

module.exports = router;
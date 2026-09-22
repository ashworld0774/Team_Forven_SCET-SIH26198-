const express = require("express");
const router = express.Router();
const { getAllDoctors, getDoctorById, acceptDoctor, rejectDoctor } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/adminMiddleware");

router.get("/doctors", protectAdmin, getAllDoctors);
router.get("/doctors/:id", protectAdmin, getDoctorById);
router.put("/doctors/:id/accept", protectAdmin, acceptDoctor);
router.put("/doctors/:id/reject", protectAdmin, rejectDoctor);

module.exports = router;
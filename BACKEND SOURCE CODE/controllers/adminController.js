const Doctor = require("../models/Doctor");
const { sendAcceptanceEmail, sendRejectionEmail } = require("../utils/sendEmail");

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Admin
const getAllDoctors = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending
    const filter = status ? { status } : {};
    const doctors = await Doctor.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/admin/doctors/:id
// @access  Admin
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Accept doctor
// @route   PUT /api/admin/doctors/:id/accept
// @access  Admin
const acceptDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (doctor.status === "accepted") {
      return res.status(400).json({ message: "Doctor already accepted" });
    }

    doctor.status = "accepted";
    doctor.canLogin = true;
    await doctor.save();

    // Send email
    await sendAcceptanceEmail(doctor.email, doctor.name);

    res.json({ message: `Dr. ${doctor.name} has been accepted successfully.`, doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reject doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Admin
const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (doctor.status === "rejected") {
      return res.status(400).json({ message: "Doctor already rejected" });
    }

    doctor.status = "rejected";
    doctor.canLogin = false;
    await doctor.save();

    // Send email
    await sendRejectionEmail(doctor.email, doctor.name);

    res.json({ message: `Dr. ${doctor.name} has been rejected.`, doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, acceptDoctor, rejectDoctor };
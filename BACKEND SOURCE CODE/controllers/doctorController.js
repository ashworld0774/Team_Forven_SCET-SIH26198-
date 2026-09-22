const Doctor = require("../models/Doctor");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Doctor (protected)
const getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id).select("-password");
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update profile photo
// @route   PUT /api/doctor/profile/photo
// @access  Doctor (protected)
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    // Cloudinary pe upload
    const photoUrl = await uploadToCloudinary(req.file.path, "doctor_profiles");

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor._id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile photo updated successfully",
      profilePhoto: doctor.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getProfile, updateProfilePhoto };
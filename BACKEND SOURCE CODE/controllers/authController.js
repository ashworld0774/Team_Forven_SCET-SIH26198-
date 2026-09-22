const Doctor = require("../models/Doctor");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadToCloudinary } = require("../config/cloudinary");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register new doctor
// @route   POST /api/auth/register
// @access  Public
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, specialityCustom, registrationNumber } = req.body;

    if (!name || !email || !password || !speciality || !registrationNumber) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Certificate is required" });
    }

    const existing = await Doctor.findOne({ email });
    if (existing) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Cloudinary pe upload
    const certificateUrl = await uploadToCloudinary(req.file.path, "doctor_certificates");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      specialityCustom: speciality === "Other" ? specialityCustom : "",
      registrationNumber,
      certificateUrl,
    });

    res.status(201).json({
      message: "Registration successful. Awaiting admin approval.",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        status: doctor.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Doctor login
// @route   POST /api/auth/login
// @access  Public
const loginDoctor = async (req, res) => {
  try {
    const { name, password } = req.body;

    const doctor = await Doctor.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!doctor.canLogin) {
      return res.status(403).json({
        message:
          doctor.status === "pending"
            ? "Your application is still under review."
            : "Your application was rejected.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(doctor._id, "doctor");

    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        profilePhoto: doctor.profilePhoto,
        status: doctor.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken(admin._id, "admin");

    res.json({
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerDoctor, loginDoctor, loginAdmin };
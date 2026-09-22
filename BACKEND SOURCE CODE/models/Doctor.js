const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    speciality: {
      type: String,
      required: true,
      enum: ["Cardiology", "Neurology", "Oncology", "Radiology", "Other"],
    },
    specialityCustom: {
      type: String, // jab Other select ho
      default: "",
    },
    certificateUrl: {
      type: String,
      required: [true, "Certificate is required"],
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    canLogin: {
      type: Boolean,
      default: false, // sirf accept hone ke baad true hoga
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
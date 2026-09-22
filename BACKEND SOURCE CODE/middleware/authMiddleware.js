const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

const protectDoctor = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const doctor = await Doctor.findById(decoded.id).select("-password");

      if (!doctor) {
        return res.status(401).json({ message: "Doctor not found" });
      }

      if (!doctor.canLogin) {
        return res.status(403).json({
          message: "Access denied. Your application is not accepted yet.",
        });
      }

      req.doctor = doctor;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protectDoctor };
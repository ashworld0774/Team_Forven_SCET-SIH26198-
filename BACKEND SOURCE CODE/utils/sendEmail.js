const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password use karo
  },
});

const sendAcceptanceEmail = async (doctorEmail, doctorName) => {
  const mailOptions = {
    from: `"Doctor Platform" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: "🎉 Application Accepted — Doctor Platform",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2ecc71;">Congratulations, Dr. ${doctorName}!</h2>
        <p>Your application has been <strong>accepted</strong> by our admin team.</p>
        <p>You can now log in to the Doctor Platform using your registered credentials.</p>
        <br/>
        <p>Welcome aboard! 🏥</p>
        <hr/>
        <small>Doctor Platform Team</small>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendRejectionEmail = async (doctorEmail, doctorName) => {
  const mailOptions = {
    from: `"Doctor Platform" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: "Application Update — Doctor Platform",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #e74c3c;">Dear Dr. ${doctorName},</h2>
        <p>We regret to inform you that your application has been <strong>rejected</strong>.</p>
        <p>Your certificate or registration details could not be verified at this time.</p>
        <p>You may re-apply with updated documents.</p>
        <br/>
        <hr/>
        <small>Doctor Platform Team</small>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendAcceptanceEmail, sendRejectionEmail };
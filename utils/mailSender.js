const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const mailSender = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `Inventory Management Application <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = mailSender;

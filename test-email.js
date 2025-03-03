require("dotenv").config({ path: "C:/Users/N.P KOIKOI/Desktop/flare/.env" });

const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Missing EMAIL_USER or EMAIL_PASS in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "phenyokoikoi3@gmail.com", // Use a real email for testing
  subject: "Test Email",
  text: "This is a test",
}, (err, info) => {
  if (err) {
    console.error("Test error:", err);
  } else {
    console.log("Test success:", info.response);
  }
});
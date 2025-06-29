// src/utils/Mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // or use 'smtp.office365.com' for Outlook
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // e.g., yourname@yourdomain.com
    pass: process.env.SMTP_PASS, // app password or real password
  },
});

module.exports = transporter;

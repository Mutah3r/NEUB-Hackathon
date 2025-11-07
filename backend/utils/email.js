const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM = EMAIL_USER,
} = process.env;

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
    secure: false,
    auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
  });
  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const tx = getTransporter();
  const info = await tx.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return info;
}

module.exports = {
  sendEmail,
};
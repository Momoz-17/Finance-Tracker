const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // The 16-character App Password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `Finance Tracker <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #6366f1;">Finance Tracker Verification</h2>
        <p>Hello,</p>
        <p>${options.message}</p>
        <div style="background: #f8fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f172a; border-radius: 8px; margin: 20px 0;">
          ${options.otp}
        </div>
        <p style="font-size: 12px; color: #64748b;">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
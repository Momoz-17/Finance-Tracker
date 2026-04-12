const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter with robust settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This MUST be the 16-character App Password
    },
    tls: {
      // Prevents "self-signed certificate" errors on hosting platforms like Render
      rejectUnauthorized: false 
    }
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #6366f1; text-align: center;">Verification Code</h2>
        <p style="color: #475569; font-size: 16px;">Hello,</p>
        <p style="color: #475569; font-size: 16px;">${options.message}</p>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; border-radius: 12px; margin: 25px 0; border: 1px dashed #cbd5e1;">
          ${options.otp}
        </div>
        <p style="font-size: 13px; color: #94a3b8; text-align: center;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  // 3. Send the email and catch errors locally for debugging
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error: ", error);
    throw new Error("Email could not be sent. Check your App Password and Render logs.");
  }
};

module.exports = sendEmail;
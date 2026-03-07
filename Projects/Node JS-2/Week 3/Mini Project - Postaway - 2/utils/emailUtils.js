import nodemailer from "nodemailer";

/**
 * Mail transporter configuration
 * Uses Gmail SMTP but can easily be switched to other providers.
 */
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generic email sender utility
 * All specialized email functions reuse this method.
 */
const dispatchEmail = async (recipient, subject, textContent, htmlContent) => {
  const emailPayload = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    await mailTransporter.sendMail(emailPayload);
    console.log(`[Email Service] Message successfully sent to ${recipient}`);
  } catch (error) {
    console.error("[Email Service Error]:", error.message);
    throw error;
  }
};

/**
 * Send OTP email for password reset
 */
export const sendOtpEmail = async (recipient, otpCode) => {
  const subject = "Password Reset Verification Code";

  const textContent = `Your password reset OTP is ${otpCode}. This code will expire in 10 minutes.`;

  const htmlContent = `
    <p>Your password reset OTP is <strong>${otpCode}</strong>.</p>
    <p>This code will expire in <strong>10 minutes</strong>.</p>
  `;

  await dispatchEmail(recipient, subject, textContent, htmlContent);
};

/**
 * Send welcome email after user registration
 */
export const sendRegistrationEmail = async (recipient, userName) => {
  const subject = "Welcome to the Platform";

  const textContent = `Hi ${userName}, thank you for registering with our platform.`;

  const htmlContent = `
    <p>Hello <strong>${userName}</strong>,</p>
    <p>Thank you for registering with our platform. We are excited to have you here!</p>
  `;

  await dispatchEmail(recipient, subject, textContent, htmlContent);
};

/**
 * Send notification after successful password reset
 */
export const sendPasswordResetSuccessEmail = async (recipient) => {
  const subject = "Password Reset Confirmation";

  const textContent =
    "Your password has been reset successfully. If you did not request this change, please contact support immediately.";

  const htmlContent = `
    <p>Your password has been reset successfully.</p>
    <p>If you did not request this change, please contact support immediately.</p>
  `;

  await dispatchEmail(recipient, subject, textContent, htmlContent);
};

/**
 * Send security alert email for suspicious activity
 */
export const sendAccountSecurityAlert = async (recipient) => {
  const subject = "Account Security Alert";

  const textContent =
    "Suspicious activity was detected on your account. Your account has been temporarily locked.";

  const htmlContent = `
    <p>We detected suspicious activity on your account.</p>
    <p>Your account has been temporarily locked for security reasons.</p>
  `;

  await dispatchEmail(recipient, subject, textContent, htmlContent);
};

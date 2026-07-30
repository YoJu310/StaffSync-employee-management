import { createTransport } from "nodemailer";

const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SENDER_EMAIL);

if (!isSmtpConfigured) {
  console.warn("SMTP config is missing. Email sending is disabled until SMTP_USER, SMTP_PASS, and SENDER_EMAIL are set.");
}

// Create a transporter using SMTP
const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({to, subject, body}) => {
    if (!isSmtpConfigured) {
        return { skipped: true, reason: "smtp-not-configured" };
    }

    try {
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body
        })
        return response;
    } catch (error) {
        console.error("Email send failed:", error);
        throw error;
    }
}

export default sendEmail;
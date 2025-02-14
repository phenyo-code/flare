import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Create a transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_PORT === "465", // Use SSL for port 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.MAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject line
      html, // HTML body content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email.");
  }
}

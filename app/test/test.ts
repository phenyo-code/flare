import { sendEmail } from "@/lib/email"; // Import the sendEmail function

export async function testEmailSending() {
  const testEmail = "phenyokoikoi3@gmail.com"; // Replace with the test email address
  const subject = "Test Email";
  const htmlContent = `
    <p>This is a test email from your application.</p>
    <p>If you're seeing this, the email setup is working.</p>
  `;
  
  try {
    const response = await sendEmail(testEmail, subject, htmlContent);
    console.log("Test email sent successfully:", response);
  } catch (error) {
    console.error("Error sending test email:", error);
  }
}

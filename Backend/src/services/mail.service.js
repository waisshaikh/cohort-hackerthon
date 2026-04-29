import { Resend } from "resend";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY is not configured. Email sending is disabled until the environment variable is set."
    );
    return null;
  }

  return new Resend(apiKey);
};

export async function sendEmail({ to, subject, html }) {
  const resend = getResendClient();

  if (!resend) {
    return {
      success: false,
      message: "Email service is not configured",
    };
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export default {
  sendEmail,
};

import SibApiV3Sdk from "sib-api-v3-sdk";

const getBrevoClient = () => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("BREVO_API_KEY is not configured");
    return null;
  }

  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications["api-key"].apiKey = apiKey;

  return new SibApiV3Sdk.TransactionalEmailsApi();
};

export async function sendEmail({ to, subject, html }) {
  const brevo = getBrevoClient();

  if (!brevo) {
    return {
      success: false,
      message: "Email service not configured",
    };
  }

  try {
    const response = await brevo.sendTransacEmail({
      sender: {
        email: "hacathon2@gmail.com", // tumhara verified sender
        name: "TenantDesk AI",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: html,
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

export default { sendEmail };

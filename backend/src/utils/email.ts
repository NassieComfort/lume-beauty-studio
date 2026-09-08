import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

interface NewBookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  depositAmount: number;
}

export const sendNewBookingEmail = async ({
  customerName,
  customerEmail,
  customerPhone,
  serviceName,
  date,
  startTime,
  endTime,
  price,
  depositAmount,
}: NewBookingEmailData) => {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    "nassiebcomfort@gmail.com";

  const emailFrom =
    process.env.EMAIL_FROM ||
    "onboarding@resend.dev";

  if (!resend) {
    console.warn(
      "Email sending skipped: RESEND_API_KEY is not configured."
    );
    return null;
  }

  const { data, error } =
    await resend.emails.send({
      from: emailFrom,

      to: adminEmail,

      subject:
        `New Booking - ${serviceName}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background: #f8f3ee;
          color: #3b2418;
        ">

          <h1 style="
            margin-bottom: 8px;
            color: #3b2418;
          ">
            New Appointment Booking
          </h1>

          <p style="
            color: #6b5143;
            margin-bottom: 30px;
          ">
            A new appointment has been
            submitted for Lume Beauty Studio.
          </p>

          <div style="
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 20px;
          ">

            <h2 style="
              font-size: 18px;
              margin-top: 0;
            ">
              Customer Details
            </h2>

            <p>
              <strong>Name:</strong>
              ${customerName}
            </p>

            <p>
              <strong>Email:</strong>
              ${customerEmail}
            </p>

            <p>
              <strong>Phone:</strong>
              ${customerPhone}
            </p>

          </div>

          <div style="
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 20px;
          ">

            <h2 style="
              font-size: 18px;
              margin-top: 0;
            ">
              Appointment Details
            </h2>

            <p>
              <strong>Service:</strong>
              ${serviceName}
            </p>

            <p>
              <strong>Date:</strong>
              ${date}
            </p>

            <p>
              <strong>Time:</strong>
              ${startTime} - ${endTime}
            </p>

          </div>

          <div style="
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
          ">

            <h2 style="
              font-size: 18px;
              margin-top: 0;
            ">
              Payment
            </h2>

            <p>
              <strong>Service Price:</strong>
              ₦${price.toLocaleString()}
            </p>

            <p>
              <strong>Required Deposit:</strong>
              ₦${depositAmount.toLocaleString()}
            </p>

            <p>
              <strong>Payment Status:</strong>
              Pending
            </p>

          </div>

          <p style="
            margin-top: 30px;
            color: #6b5143;
            font-size: 13px;
          ">
            Please sign in to the Lume admin
            dashboard to manage this appointment.
          </p>

        </div>
      `,
    });

  if (error) {
    throw new Error(
      error.message ||
        "Failed to send booking email."
    );
  }

  return data;
};
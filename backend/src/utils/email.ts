import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
};

const getEmailConfig = () => {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  const emailFrom =
    process.env.EMAIL_FROM;

  if (!adminEmail) {
    throw new Error(
      "ADMIN_EMAIL is not configured."
    );
  }

  if (!emailFrom) {
    throw new Error(
      "EMAIL_FROM is not configured."
    );
  }

  return {
    adminEmail,
    emailFrom,
  };
};

// ======================================================
// NEW BOOKING → ADMIN
// ======================================================

export const sendNewBookingEmail =
  async ({
    customerName,
    customerEmail,
    customerPhone,
    serviceName,
    date,
    startTime,
    endTime,
    price,
    depositAmount,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    depositAmount: number;
  }) => {
    const {
      adminEmail,
      emailFrom,
    } =
      getEmailConfig();

    const resend = getResendClient();

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
          `New Lume Booking — ${serviceName}`,

        html: `
          <h2>New Appointment Booking</h2>

          <p>
            A new appointment has been
            submitted.
          </p>

          <h3>Customer</h3>

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

          <h3>Appointment</h3>

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

          <h3>Payment</h3>

          <p>
            <strong>Price:</strong>
            ₦${price.toLocaleString()}
          </p>

          <p>
            <strong>Deposit:</strong>
            ₦${depositAmount.toLocaleString()}
          </p>

          <p>
            <strong>Status:</strong>
            Pending
          </p>
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

// ======================================================
// CUSTOMER EMAIL HELPER
// ======================================================

const sendCustomerEmail =
  async ({
    email,
    subject,
    title,
    message,
  }: {
    email: string;
    subject: string;
    title: string;
    message: string;
  }) => {
    const { emailFrom } =
      getEmailConfig();

    const resend = getResendClient();

    if (!resend) {
      console.warn(
        "Email sending skipped: RESEND_API_KEY is not configured."
      );
      return null;
    }

    const { data, error } =
      await resend.emails.send({
        from: emailFrom,
        to: email,
        subject,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 30px;
              background: #f8f3ee;
              color: #3b2418;
            "
          >
            <h1>${title}</h1>

            <p>
              ${message}
            </p>

            <p>
              Thank you for choosing
              Lume Beauty Studio.
            </p>
          </div>
        `,
      });

    if (error) {
      throw new Error(
        error.message ||
          "Failed to send email."
      );
    }

    return data;
  };

// ======================================================
// BOOKING CONFIRMATION
// ======================================================

export const sendBookingConfirmationEmail =
  async ({
    email,
    name,
    serviceName,
    date,
    startTime,
    endTime,
  }: {
    email: string;
    name: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    return sendCustomerEmail({
      email,

      subject:
        "Your Lume appointment is confirmed",

      title:
        "Appointment Confirmed",

      message: `
        Hi ${name},<br><br>

        Your appointment for
        <strong>${serviceName}</strong>
        has been confirmed.<br><br>

        <strong>Date:</strong> ${date}<br>
        <strong>Time:</strong>
        ${startTime} - ${endTime}<br><br>

        We look forward to seeing you.
      `,
    });
  };

// ======================================================
// BOOKING CANCELLATION
// ======================================================

export const sendBookingCancellationEmail =
  async ({
    email,
    name,
    serviceName,
    date,
    startTime,
  }: {
    email: string;
    name: string;
    serviceName: string;
    date: string;
    startTime: string;
  }) => {
    return sendCustomerEmail({
      email,

      subject:
        "Your Lume appointment has been cancelled",

      title:
        "Appointment Cancelled",

      message: `
        Hi ${name},<br><br>

        Your appointment for
        <strong>${serviceName}</strong>
        scheduled for
        <strong>${date}</strong>
        at
        <strong>${startTime}</strong>
        has been cancelled.
      `,
    });
  };

// ======================================================
// PASSWORD RESET
// ======================================================

export const sendPasswordResetEmail =
  async ({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }) => {
    const frontendUrl =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password?token=${token}`;

    return sendCustomerEmail({
      email,

      subject:
        "Reset your Lume admin password",

      title:
        "Password Reset",

      message: `
        Hi ${name},<br><br>

        We received a request to reset
        your password.<br><br>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#3b2418;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>
        <br><br>

        This link expires in 15 minutes.
      `,
    });
  };
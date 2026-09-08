import { Request, Response, NextFunction } from "express";

import Appointment from "../models/Appointment";
import Service from "../models/Service";
import Availability from "../models/Availability";
import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";
import { sendNewBookingEmail } from "../utils/email";

const DEPOSIT_PERCENTAGE = 30;

// ======================================================
// TIME HELPERS
// ======================================================

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return NaN;
  }

  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${mins}`;
};

// ======================================================
// DATE HELPER
// ======================================================

const parseLocalDate = (dateStr: string): Date => {
  const parts = dateStr.split("-");

  if (parts.length !== 3) {
    return new Date("invalid");
  }

  const [year, month, day] = parts.map(Number);

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return new Date("invalid");
  }

  return new Date(Date.UTC(year, month - 1, day));
};

// ======================================================
// CREATE APPOINTMENT
// ======================================================

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      serviceId,
      date,
      startTime,
      guestName,
      guestEmail,
      guestPhone,
      notes,
    } = req.body;

    // --------------------------------------------------
    // 1. REQUIRED FIELDS
    // --------------------------------------------------

    if (
      !serviceId ||
      !date ||
      !startTime ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      return next(
        new AppError(
          "Please provide all required booking details.",
          400
        )
      );
    }

    // --------------------------------------------------
    // 2. VALIDATE TIME
    // --------------------------------------------------

    const requestedStart = timeToMinutes(startTime);

    if (Number.isNaN(requestedStart)) {
      return next(
        new AppError(
          "Invalid appointment time format.",
          400
        )
      );
    }

    // --------------------------------------------------
    // 3. FIND SERVICE
    // --------------------------------------------------

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return next(
        new AppError(
          "Selected service is not available.",
          404
        )
      );
    }

    // --------------------------------------------------
    // 4. CALCULATE APPOINTMENT END TIME
    // --------------------------------------------------

    const requestedEnd =
      requestedStart + service.duration;

    if (requestedEnd > 24 * 60) {
      return next(
        new AppError(
          "This appointment extends beyond the end of the day.",
          400
        )
      );
    }

    const endTime = minutesToTime(requestedEnd);

    // --------------------------------------------------
    // 5. PARSE DATE
    // --------------------------------------------------

    const appointmentDate = parseLocalDate(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return next(
        new AppError(
          "Invalid appointment date.",
          400
        )
      );
    }

    // --------------------------------------------------
    // 6. PREVENT PAST BOOKINGS
    // --------------------------------------------------

    const today = new Date();

    today.setUTCHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return next(
        new AppError(
          "Appointments cannot be booked for a past date.",
          400
        )
      );
    }

    // --------------------------------------------------
    // 7. CHECK DAY AVAILABILITY
    // --------------------------------------------------

    const dayOfWeek =
      appointmentDate.getUTCDay();

    const availability =
      await Availability.findOne({
        dayOfWeek,
      });

    // If no availability record exists,
    // use the default studio hours.
    const studioAvailability = availability ?? {
      isOpen: true,
      openingTime: "09:00",
      closingTime: "18:00",
    };

    if (!studioAvailability.isOpen) {
      return next(
        new AppError(
          "The studio is closed on this day.",
          400
        )
      );
    }

    const openingTime =
      studioAvailability.openingTime ?? "09:00";

    const closingTime =
      studioAvailability.closingTime ?? "18:00";

    const openingMinutes =
      timeToMinutes(openingTime);

    const closingMinutes =
      timeToMinutes(closingTime);

    if (
      Number.isNaN(openingMinutes) ||
      Number.isNaN(closingMinutes)
    ) {
      return next(
        new AppError(
          "Studio availability settings are invalid.",
          500
        )
      );
    }

    // --------------------------------------------------
    // 8. CHECK OPENING TIME
    // --------------------------------------------------

    if (requestedStart < openingMinutes) {
      return next(
        new AppError(
          `Selected time is before opening hours. Studio opens at ${openingTime}.`,
          400
        )
      );
    }

    // --------------------------------------------------
    // 9. CHECK CLOSING TIME
    // --------------------------------------------------

    if (requestedEnd > closingMinutes) {
      return next(
        new AppError(
          `Appointment ends at ${endTime}, which is past closing time (${closingTime}).`,
          400
        )
      );
    }

    // --------------------------------------------------
    // 10. CHECK BLOCKED SLOTS
    // --------------------------------------------------

    const blockedSlots =
      await BlockedSlot.find({
        date,
      });

    for (const blocked of blockedSlots) {
      if (
        !blocked.startTime ||
        !blocked.endTime
      ) {
        return next(
          new AppError(
            "The studio is unavailable on this date.",
            400
          )
        );
      }

      const blockedStart =
        timeToMinutes(
          blocked.startTime
        );

      const blockedEnd =
        timeToMinutes(
          blocked.endTime
        );

      if (
        Number.isNaN(blockedStart) ||
        Number.isNaN(blockedEnd)
      ) {
        continue;
      }

      const overlaps =
        requestedStart < blockedEnd &&
        requestedEnd > blockedStart;

      if (overlaps) {
        return next(
          new AppError(
            "Selected time overlaps with a blocked slot.",
            400
          )
        );
      }
    }

    // --------------------------------------------------
    // 11. CHECK EXISTING APPOINTMENTS
    // --------------------------------------------------

    const existingAppointments =
      await Appointment.find({
        appointmentDate,
        status: {
          $in: [
            "pending",
            "confirmed",
          ],
        },
      });

    for (const existing of existingAppointments) {
      const existingStart =
        timeToMinutes(
          existing.startTime
        );

      const existingEnd =
        timeToMinutes(
          existing.endTime
        );

      const overlaps =
        requestedStart < existingEnd &&
        requestedEnd > existingStart;

      if (overlaps) {
        return next(
          new AppError(
            "This time slot has already been booked.",
            409
          )
        );
      }
    }

    // --------------------------------------------------
    // 12. CALCULATE PAYMENT
    // --------------------------------------------------

    const price = service.price;

    const depositAmount =
      price *
      (DEPOSIT_PERCENTAGE / 100);

    // --------------------------------------------------
    // 13. CREATE APPOINTMENT
    // --------------------------------------------------

    const appointment =
      await Appointment.create({
        customerName:
          guestName.trim(),

        customerEmail:
          guestEmail
            .trim()
            .toLowerCase(),

        customerPhone:
          guestPhone.trim(),

        service:
          service._id,

        appointmentDate,

        startTime,

        endTime,

        price,

        depositAmount,

        paymentStatus:
          "pending",

        status:
          "pending",

        notes:
          notes?.trim(),
      });

    // --------------------------------------------------
    // 14. SEND ADMIN EMAIL
    // --------------------------------------------------
    // IMPORTANT:
    // Email failure must NOT cancel the booking.
    // The appointment has already been saved.

    try {
      await sendNewBookingEmail({
        customerName:
          appointment.customerName,

        customerEmail:
          appointment.customerEmail,

        customerPhone:
          appointment.customerPhone,

        serviceName:
          service.name,

        date,

        startTime,

        endTime,

        price,

        depositAmount,
      });
    } catch (emailError) {
      console.error(
        "Failed to send new booking email:",
        emailError
      );
    }

    // --------------------------------------------------
    // 15. RETURN SUCCESS
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Appointment request submitted successfully.",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "Create appointment error:",
      error
    );

    return next(error);
  }
};

// ======================================================
// GET ALL APPOINTMENTS
// ======================================================

export const getAllAppointments = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments =
      await Appointment.find()
        .populate(
          "service",
          "name price duration category"
        )
        .sort({
          appointmentDate: 1,
          startTime: 1,
        });

    return res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    return next(error);
  }
};

// ======================================================
// GET APPOINTMENT BY ID
// ======================================================

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      ).populate(
        "service",
        "name price duration category"
      );

    if (!appointment) {
      return next(
        new AppError(
          "Appointment not found.",
          404
        )
      );
    }

    return res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

// ======================================================
// UPDATE APPOINTMENT STATUS
// ======================================================

export const updateAppointmentStatus =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "rescheduled",
        "no-show",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return next(
          new AppError(
            "Invalid appointment status.",
            400
          )
        );
      }

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!appointment) {
        return next(
          new AppError(
            "Appointment not found.",
            404
          )
        );
      }

      return res.json({
        success: true,

        message:
          "Appointment status updated successfully.",

        data: appointment,
      });
    } catch (error) {
      return next(error);
    }
  };

// ======================================================
// UPDATE PAYMENT STATUS
// ======================================================

export const updateAppointmentPayment =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { paymentStatus } =
        req.body;

      const allowedStatuses = [
        "pending",
        "paid",
        "failed",
        "refunded",
      ];

      if (
        !allowedStatuses.includes(
          paymentStatus
        )
      ) {
        return next(
          new AppError(
            "Invalid payment status.",
            400
          )
        );
      }

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          { paymentStatus },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!appointment) {
        return next(
          new AppError(
            "Appointment not found.",
            404
          )
        );
      }

      return res.json({
        success: true,

        message:
          "Payment status updated successfully.",

        data: appointment,
      });
    } catch (error) {
      return next(error);
    }
  };

// ======================================================
// CANCEL APPOINTMENT
// ======================================================

export const cancelAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return next(
        new AppError(
          "Appointment not found.",
          404
        )
      );
    }

    if (
      appointment.status ===
      "completed"
    ) {
      return next(
        new AppError(
          "Completed appointments cannot be cancelled.",
          400
        )
      );
    }

    if (
      appointment.status ===
      "cancelled"
    ) {
      return next(
        new AppError(
          "Appointment is already cancelled.",
          400
        )
      );
    }

    appointment.status =
      "cancelled";

    await appointment.save();

    return res.json({
      success: true,

      message:
        "Appointment cancelled successfully.",

      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};
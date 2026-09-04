import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment";
import Service from "../models/Service";
import Availability from "../models/Availability";
import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";

const DEPOSIT_PERCENTAGE = 30;

// =========================
// TIME HELPERS
// =========================

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

// =========================
// CREATE APPOINTMENT
// =========================

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("=================================");
    console.log("CREATE APPOINTMENT REQUEST");
    console.log("Request body:", req.body);
    console.log("=================================");

    const {
      serviceId,
      date,
      startTime,
      guestName,
      guestEmail,
      guestPhone,
      notes,
    } = req.body;

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (
      !serviceId ||
      !date ||
      !startTime ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      console.log("❌ Missing required booking fields");

      return next(
        new AppError(
          "Please provide all required booking details.",
          400
        )
      );
    }

    // =========================
    // VALIDATE TIME
    // =========================

    const requestedStart = timeToMinutes(startTime);

    if (Number.isNaN(requestedStart)) {
      return next(
        new AppError(
          "Invalid appointment time.",
          400
        )
      );
    }

    // =========================
    // FIND SERVICE
    // =========================

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return next(
        new AppError(
          "Service not found.",
          404
        )
      );
    }

    // =========================
    // CALCULATE END TIME
    // =========================

    const requestedEnd =
      requestedStart + service.duration;

    const endTime = minutesToTime(requestedEnd);

    // =========================
    // VALIDATE DATE
    // =========================

    const appointmentDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(appointmentDate.getTime())) {
      return next(
        new AppError(
          "Invalid appointment date.",
          400
        )
      );
    }

    // Prevent booking dates in the past

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return next(
        new AppError(
          "Appointments cannot be booked for a past date.",
          400
        )
      );
    }

    // =========================
    // CHECK AVAILABILITY
    // =========================

    const dayOfWeek = appointmentDate.getDay();

    // Fetch availability record or default to open hours (09:00 - 18:00)
    const availability = (await Availability.findOne({
      dayOfWeek,
    })) ?? {
      isOpen: true,
      openingTime: "09:00",
      closingTime: "18:00",
    };

    if (!availability.isOpen) {
      return next(
        new AppError(
          "The studio is closed on this day.",
          400
        )
      );
    }

    const openingTime = availability.openingTime ?? "09:00";
    const closingTime = availability.closingTime ?? "18:00";

    const openingMinutes = timeToMinutes(openingTime);
    const closingMinutes = timeToMinutes(closingTime);

    // Before opening

    if (requestedStart < openingMinutes) {
      return next(
        new AppError(
          `Selected time is before opening hours. The studio opens at ${openingTime}.`,
          400
        )
      );
    }

    // After closing

    if (requestedEnd > closingMinutes) {
      return next(
        new AppError(
          `This appointment would end at ${endTime}, which is after closing time (${closingTime}).`,
          400
        )
      );
    }

    // =========================
    // CHECK BLOCKED SLOTS
    // =========================

    const blockedSlots =
      await BlockedSlot.find({
        date,
      });

    for (const blocked of blockedSlots) {
      // Full-day blocked slot

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

      const blockedStart = timeToMinutes(
        blocked.startTime
      );

      const blockedEnd = timeToMinutes(
        blocked.endTime
      );

      const overlaps =
        requestedStart < blockedEnd &&
        requestedEnd > blockedStart;

      if (overlaps) {
        return next(
          new AppError(
            "Selected time is unavailable.",
            400
          )
        );
      }
    }

    // =========================
    // CHECK EXISTING APPOINTMENTS
    // =========================

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

    for (
      const existingAppointment of existingAppointments
    ) {
      const existingStart = timeToMinutes(
        existingAppointment.startTime
      );

      const existingEnd = timeToMinutes(
        existingAppointment.endTime
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

    // =========================
    // CALCULATE PRICE
    // =========================

    const price = service.price;

    const depositAmount =
      price *
      (DEPOSIT_PERCENTAGE / 100);

    // =========================
    // CREATE APPOINTMENT
    // =========================

    const appointment =
      await Appointment.create({
        customerName: guestName.trim(),

        customerEmail:
          guestEmail.trim().toLowerCase(),

        customerPhone:
          guestPhone.trim(),

        service: service._id,

        appointmentDate,

        startTime,

        endTime,

        price,

        depositAmount,

        paymentStatus: "pending",

        status: "pending",

        notes: notes?.trim(),
      });

    console.log(
      "✅ Appointment created:",
      appointment._id
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      success: true,
      message:
        "Appointment request submitted successfully.",
      data: appointment,
    });
  } catch (error) {
    console.error(
      "❌ Create appointment error:",
      error
    );

    next(error);
  }
};

// =========================
// GET ALL APPOINTMENTS
// =========================

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
    next(error);
  }
};

// =========================
// GET APPOINTMENT BY ID
// =========================

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
    next(error);
  }
};

// =========================
// UPDATE STATUS
// =========================

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
      next(error);
    }
  };

// =========================
// CANCEL APPOINTMENT
// =========================

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
      appointment.status === "completed"
    ) {
      return next(
        new AppError(
          "Completed appointments cannot be cancelled.",
          400
        )
      );
    }

    if (
      appointment.status === "cancelled"
    ) {
      return next(
        new AppError(
          "Appointment is already cancelled.",
          400
        )
      );
    }

    appointment.status = "cancelled";

    await appointment.save();

    return res.json({
      success: true,
      message:
        "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
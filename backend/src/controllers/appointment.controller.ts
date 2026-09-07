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

// Normalized Date Parser (UTC Midnight for consistent Mongo queries)
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
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
    const {
      serviceId,
      date,
      startTime,
      guestName,
      guestEmail,
      guestPhone,
      notes,
    } = req.body;

    if (
      !serviceId ||
      !date ||
      !startTime ||
      !guestName ||
      !guestEmail ||
      !guestPhone
    ) {
      return next(
        new AppError("Please provide all required booking details.", 400)
      );
    }

    const requestedStart = timeToMinutes(startTime);
    if (Number.isNaN(requestedStart)) {
      return next(new AppError("Invalid appointment time format.", 400));
    }

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return next(new AppError("Selected service is not available.", 404));
    }

    const requestedEnd = requestedStart + service.duration;
    const endTime = minutesToTime(requestedEnd);

    const appointmentDate = parseLocalDate(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return next(new AppError("Invalid appointment date.", 400));
    }

    // Check past dates
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return next(
        new AppError("Appointments cannot be booked for a past date.", 400)
      );
    }

    // Check Day of Week Availability
    const dayOfWeek = appointmentDate.getUTCDay();
    const availability = (await Availability.findOne({ dayOfWeek })) ?? {
      isOpen: true,
      openingTime: "09:00",
      closingTime: "18:00",
    };

    if (!availability.isOpen) {
      return next(new AppError("The studio is closed on this day.", 400));
    }

    const openingTime = availability.openingTime ?? "09:00";
    const closingTime = availability.closingTime ?? "18:00";

    const openingMinutes = timeToMinutes(openingTime);
    const closingMinutes = timeToMinutes(closingTime);

    if (requestedStart < openingMinutes) {
      return next(
        new AppError(
          `Selected time is before opening hours. Studio opens at ${openingTime}.`,
          400
        )
      );
    }

    if (requestedEnd > closingMinutes) {
      return next(
        new AppError(
          `Appointment ends at ${endTime}, which is past closing time (${closingTime}).`,
          400
        )
      );
    }

    // Check Blocked Slots
    const blockedSlots = await BlockedSlot.find({ date });

    for (const blocked of blockedSlots) {
      if (!blocked.startTime || !blocked.endTime) {
        return next(
          new AppError("The studio is unavailable on this date.", 400)
        );
      }

      const blockedStart = timeToMinutes(blocked.startTime);
      const blockedEnd = timeToMinutes(blocked.endTime);

      if (requestedStart < blockedEnd && requestedEnd > blockedStart) {
        return next(
          new AppError("Selected time overlaps with a blocked slot.", 400)
        );
      }
    }

    // Check Existing Appointments
    const existingAppointments = await Appointment.find({
      appointmentDate,
      status: { $in: ["pending", "confirmed"] },
    });

    for (const existing of existingAppointments) {
      const existingStart = timeToMinutes(existing.startTime);
      const existingEnd = timeToMinutes(existing.endTime);

      if (requestedStart < existingEnd && requestedEnd > existingStart) {
        return next(
          new AppError("This time slot has already been booked.", 409)
        );
      }
    }

    // Financial calculations
    const price = service.price;
    const depositAmount = price * (DEPOSIT_PERCENTAGE / 100);

    const appointment = await Appointment.create({
      customerName: guestName.trim(),
      customerEmail: guestEmail.trim().toLowerCase(),
      customerPhone: guestPhone.trim(),
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

    return res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
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
    const appointments = await Appointment.find()
      .populate("service", "name price duration category")
      .sort({ appointmentDate: 1, startTime: 1 });

    return res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    return next(error);
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
    const appointment = await Appointment.findById(req.params.id).populate(
      "service",
      "name price duration category"
    );

    if (!appointment) {
      return next(new AppError("Appointment not found.", 404));
    }

    return res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

// =========================
// UPDATE STATUS
// =========================

export const updateAppointmentStatus = async (
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

    if (!allowedStatuses.includes(status)) {
      return next(new AppError("Invalid appointment status.", 400));
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return next(new AppError("Appointment not found.", 404));
    }

    return res.json({
      success: true,
      message: "Appointment status updated successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};

// =========================
// UPDATE PAYMENT
// =========================

export const updateAppointmentPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentStatus } = req.body;
    const allowedStatuses = ["pending", "paid", "failed", "refunded"];

    if (!allowedStatuses.includes(paymentStatus)) {
      return next(new AppError("Invalid payment status.", 400));
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return next(new AppError("Appointment not found.", 404));
    }

    return res.json({
      success: true,
      message: "Payment status updated successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new AppError("Appointment not found.", 404));
    }

    if (appointment.status === "completed") {
      return next(
        new AppError("Completed appointments cannot be cancelled.", 400)
      );
    }

    if (appointment.status === "cancelled") {
      return next(
        new AppError("Appointment is already cancelled.", 400)
      );
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    return next(error);
  }
};
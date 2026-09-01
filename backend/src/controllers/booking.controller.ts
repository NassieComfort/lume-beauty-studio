import { Request, Response, NextFunction } from "express";
import Appointment from "../models/Appointment";
import Service from "../models/Service";
import Availability from "../models/Availability";
import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";

const DEPOSIT_PERCENTAGE = 30;

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${mins}`;
};

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
      name,
      email,
      phone,
      notes,
    } = req.body;

    // Validate booking details
    if (
      !serviceId ||
      !date ||
      !startTime ||
      !name ||
      !email ||
      !phone
    ) {
      return next(
        new AppError(
          "Please provide all required booking details.",
          400
        )
      );
    }

    // Find active service
    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    // Calculate appointment end time
    const requestedStart = timeToMinutes(startTime);

    const requestedEnd =
      requestedStart + service.duration;

    const endTime = minutesToTime(requestedEnd);

    // Create appointment date
    const appointmentDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(appointmentDate.getTime())) {
      return next(
        new AppError("Invalid appointment date", 400)
      );
    }

    // Get day of week
    const dayOfWeek = appointmentDate.getDay();

    // Check studio availability
    const availability = await Availability.findOne({
      dayOfWeek,
    });

    if (!availability || !availability.isOpen) {
      return next(
        new AppError(
          "The studio is closed on this day.",
          400
        )
      );
    }

    // Check opening time
    if (
      availability.openingTime &&
      requestedStart <
        timeToMinutes(availability.openingTime)
    ) {
      return next(
        new AppError(
          "Selected time is before opening hours.",
          400
        )
      );
    }

    // Check closing time
    if (
      availability.closingTime &&
      requestedEnd >
        timeToMinutes(availability.closingTime)
    ) {
      return next(
        new AppError(
          "Selected appointment extends beyond closing hours.",
          400
        )
      );
    }

    // Check blocked slots
    const blockedSlots = await BlockedSlot.find({
      date,
    });

    for (const blocked of blockedSlots) {
      // Full-day blocked slot
      if (!blocked.startTime || !blocked.endTime) {
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

    // Check existing appointments
    const existingAppointments =
      await Appointment.find({
        appointmentDate,
        status: {
          $in: ["pending", "confirmed"],
        },
      });

    for (const appointment of existingAppointments) {
      const existingStart = timeToMinutes(
        appointment.startTime
      );

      const existingEnd = timeToMinutes(
        appointment.endTime
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

    // Calculate deposit
    const depositAmount =
      service.price * (DEPOSIT_PERCENTAGE / 100);

    // Create appointment
    const appointment = await Appointment.create({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,

      service: service._id,

      appointmentDate,
      startTime,
      endTime,

      price: service.price,
      depositAmount,

      paymentStatus: "pending",
      status: "pending",

      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await Appointment.find()
      .populate("service", "name price duration")
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

export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment =
      await Appointment.findById(req.params.id)
        .populate(
          "service",
          "name price duration"
        );

    if (!appointment) {
      return next(
        new AppError(
          "Appointment not found",
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
      return next(
        new AppError(
          "Invalid appointment status",
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
          "Appointment not found",
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

export const cancelAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment =
      await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new AppError(
          "Appointment not found",
          404
        )
      );
    }

    if (appointment.status === "completed") {
      return next(
        new AppError(
          "Completed appointments cannot be cancelled.",
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
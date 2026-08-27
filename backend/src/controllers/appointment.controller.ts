import { RequestHandler } from "express";

import Appointment from "../models/Appointment";
import Service from "../models/Service";
import Availability from "../models/Availability";
import BlockedSlot from "../models/BlockedSlot";

import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
};

const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};

const isOverlapping = (
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean => {
  return startA < endB && endA > startB;
};

export const getAppointments: RequestHandler =
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};

    if (req.user?.role === "customer") {
      filter.user = req.user.id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const date = new Date(String(req.query.date));

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.date = {
        $gte: date,
        $lt: nextDay,
      };
    }

    const appointments = await Appointment.find(filter)
      .populate("service")
      .populate("user", "name email phone")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  });

export const getAppointment: RequestHandler =
  asyncHandler(async (req, res) => {
    const appointment =
      await Appointment.findById(req.params.id)
        .populate("service")
        .populate("user", "name email phone");

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (
      req.user?.role === "customer" &&
      appointment.user?.toString() !== req.user.id
    ) {
      throw new AppError("You cannot access this appointment", 403);
    }

    res.json({
      success: true,
      appointment,
    });
  });

export const getAvailableSlots: RequestHandler =
  asyncHandler(async (req, res) => {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      throw new AppError(
        "serviceId and date are required",
        400
      );
    }

    const service = await Service.findById(serviceId);

    if (!service || !service.isActive) {
      throw new AppError("Service not found", 404);
    }

    const selectedDate = new Date(String(date));

    if (Number.isNaN(selectedDate.getTime())) {
      throw new AppError("Invalid date", 400);
    }

    const dayOfWeek = getDayOfWeek(selectedDate);

    const availability = await Availability.findOne({
      dayOfWeek,
      isActive: true,
    });

    if (!availability) {
      return res.json({
        success: true,
        date,
        slots: [],
      });
    }

    const blockedSlots = await BlockedSlot.find({
      date: {
        $gte: new Date(
          new Date(selectedDate).setHours(0, 0, 0, 0)
        ),
        $lt: new Date(
          new Date(selectedDate).setHours(23, 59, 59, 999)
        ),
      },
    });

    const appointments = await Appointment.find({
      date: {
        $gte: new Date(
          new Date(selectedDate).setHours(0, 0, 0, 0)
        ),
        $lt: new Date(
          new Date(selectedDate).setHours(23, 59, 59, 999)
        ),
      },
      status: {
        $in: ["pending", "confirmed", "rescheduled"],
      },
    });

    const openingMinutes = timeToMinutes(
      availability.startTime
    );

    const closingMinutes = timeToMinutes(
      availability.endTime
    );

    const slotInterval = 30;

    const slots: string[] = [];

    for (
      let start = openingMinutes;
      start + service.duration <= closingMinutes;
      start += slotInterval
    ) {
      const end = start + service.duration;

      const blocked = blockedSlots.some((blockedSlot) => {
        if (
          !blockedSlot.startTime ||
          !blockedSlot.endTime
        ) {
          return true;
        }

        return isOverlapping(
          start,
          end,
          timeToMinutes(blockedSlot.startTime),
          timeToMinutes(blockedSlot.endTime)
        );
      });

      if (blocked) continue;

      const appointmentConflict = appointments.some(
        (appointment) =>
          isOverlapping(
            start,
            end,
            timeToMinutes(appointment.startTime),
            timeToMinutes(appointment.endTime)
          )
      );

      if (!appointmentConflict) {
        slots.push(minutesToTime(start));
      }
    }

    res.json({
      success: true,
      date,
      service: {
        id: service.id,
        name: service.name,
        duration: service.duration,
      },
      slots,
    });
  });

export const createAppointment: RequestHandler =
  asyncHandler(async (req, res) => {
    const {
      serviceId,
      date,
      startTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = req.body;

    if (
      !serviceId ||
      !date ||
      !startTime ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      throw new AppError(
        "Service, date, time and customer details are required",
        400
      );
    }

    const service = await Service.findById(serviceId);

    if (!service || !service.isActive) {
      throw new AppError("Service not found", 404);
    }

    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      throw new AppError("Invalid appointment date", 400);
    }

    const dayOfWeek = getDayOfWeek(appointmentDate);

    const availability = await Availability.findOne({
      dayOfWeek,
      isActive: true,
    });

    if (!availability) {
      throw new AppError(
        "The studio is closed on this day",
        400
      );
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + service.duration;

    const openingMinutes = timeToMinutes(
      availability.startTime
    );

    const closingMinutes = timeToMinutes(
      availability.endTime
    );

    if (
      startMinutes < openingMinutes ||
      endMinutes > closingMinutes
    ) {
      throw new AppError(
        "This appointment falls outside studio opening hours",
        400
      );
    }

    const blockedSlots = await BlockedSlot.find({
      date: {
        $gte: new Date(
          new Date(appointmentDate).setHours(0, 0, 0, 0)
        ),
        $lt: new Date(
          new Date(appointmentDate).setHours(23, 59, 59, 999)
        ),
      },
    });

    const blocked = blockedSlots.some((blockedSlot) => {
      if (
        !blockedSlot.startTime ||
        !blockedSlot.endTime
      ) {
        return true;
      }

      return isOverlapping(
        startMinutes,
        endMinutes,
        timeToMinutes(blockedSlot.startTime),
        timeToMinutes(blockedSlot.endTime)
      );
    });

    if (blocked) {
      throw new AppError(
        "This time is unavailable",
        409
      );
    }

    const existingAppointments =
      await Appointment.find({
        date: {
          $gte: new Date(
            new Date(appointmentDate).setHours(0, 0, 0, 0)
          ),
          $lt: new Date(
            new Date(appointmentDate).setHours(
              23,
              59,
              59,
              999
            )
          ),
        },

        status: {
          $in: ["pending", "confirmed", "rescheduled"],
        },
      });

    const conflict = existingAppointments.some(
      (appointment) =>
        isOverlapping(
          startMinutes,
          endMinutes,
          timeToMinutes(appointment.startTime),
          timeToMinutes(appointment.endTime)
        )
    );

    if (conflict) {
      throw new AppError(
        "This appointment slot has already been booked",
        409
      );
    }

    const depositAmount = service.depositAmount;

    const remainingAmount = Math.max(
      service.price - depositAmount,
      0
    );

    const appointment = await Appointment.create({
      user: req.user?.id,
      customerName,
      customerEmail,
      customerPhone,
      service: service.id,
      date: appointmentDate,
      startTime,
      endTime: minutesToTime(endMinutes),
      servicePrice: service.price,
      depositAmount,
      remainingAmount,
      paymentStatus: "pending",
      status: "pending",
      notes,
    });

    const populatedAppointment =
      await Appointment.findById(appointment.id)
        .populate("service")
        .populate("user", "name email phone");

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  });

export const updateAppointmentStatus: RequestHandler =
  asyncHandler(async (req, res) => {
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
      throw new AppError(
        "Invalid appointment status",
        400
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
      ).populate("service");

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    res.json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  });

export const updatePaymentStatus: RequestHandler =
  asyncHandler(async (req, res) => {
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "partial",
      "paid",
      "failed",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      throw new AppError(
        "Invalid payment status",
        400
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
      throw new AppError("Appointment not found", 404);
    }

    res.json({
      success: true,
      message: "Payment status updated",
      appointment,
    });
  });

export const cancelAppointment: RequestHandler =
  asyncHandler(async (req, res) => {
    const appointment =
      await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (
      req.user?.role === "customer" &&
      appointment.user?.toString() !== req.user.id
    ) {
      throw new AppError(
        "You cannot cancel this appointment",
        403
      );
    }

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      throw new AppError(
        "This appointment cannot be cancelled",
        400
      );
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  });
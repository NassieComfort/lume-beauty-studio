// services/availability.service.ts

import Availability from "../models/Availability";
import Appointment from "../models/Appointment";
import BlockedSlot from "../models/BlockedSlot";
import Service from "../models/Service";

const DEFAULT_OPENING_TIME = "09:00";
const DEFAULT_CLOSING_TIME = "18:00";

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
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

export const getAvailableSlots = async (
  date: string,
  serviceId: string
) => {
  if (!date || !serviceId) {
    throw new Error("Date and service are required.");
  }

  const service = await Service.findById(serviceId);

  if (!service || !service.isActive) {
    throw new Error("Service not found or unavailable.");
  }

  const selectedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date.");
  }

  const dayOfWeek = selectedDate.getDay();

  // -----------------------------------
  // STUDIO OPENING HOURS
  // -----------------------------------

  const availability = await Availability.findOne({
    dayOfWeek,
  });

  if (availability && !availability.isOpen) {
    return {
      date,
      serviceId,
      bookedSlots: [],
      availableSlots: [],
    };
  }

  const openingTime =
    availability?.openingTime || DEFAULT_OPENING_TIME;

  const closingTime =
    availability?.closingTime || DEFAULT_CLOSING_TIME;

  const openingMinutes = timeToMinutes(openingTime);
  const closingMinutes = timeToMinutes(closingTime);

  const serviceDuration = service.duration;

  // -----------------------------------
  // EXISTING APPOINTMENTS
  // -----------------------------------

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  const appointments = await Appointment.find({
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: {
      $nin: ["cancelled"],
    },
  }).select("startTime endTime");

  // -----------------------------------
  // BLOCKED SLOTS
  // -----------------------------------

  const blockedSlots = await BlockedSlot.find({
    date,
  }).select("startTime endTime");

  // -----------------------------------
  // CHECK WHETHER A SLOT IS OCCUPIED
  // -----------------------------------

  const isTimeBlocked = (
    slotStart: number,
    slotEnd: number
  ): boolean => {
    const appointmentBlocked = appointments.some((appointment) => {
      const appointmentStart = timeToMinutes(
        appointment.startTime
      );

      const appointmentEnd = timeToMinutes(
        appointment.endTime
      );

      return (
        slotStart < appointmentEnd &&
        slotEnd > appointmentStart
      );
    });

    if (appointmentBlocked) {
      return true;
    }

    const blockedSlotExists = blockedSlots.some((blocked) => {
      if (!blocked.startTime || !blocked.endTime) {
        return true;
      }

      const blockedStart = timeToMinutes(
        blocked.startTime
      );

      const blockedEnd = timeToMinutes(
        blocked.endTime
      );

      return (
        slotStart < blockedEnd &&
        slotEnd > blockedStart
      );
    });

    return blockedSlotExists;
  };

  // -----------------------------------
  // GENERATE BOOKING SLOTS
  // -----------------------------------

  const availableSlots: string[] = [];
  const bookedSlots: string[] = [];

  for (
    let start = openingMinutes;
    start + serviceDuration <= closingMinutes;
    start += 60
  ) {
    const end = start + serviceDuration;

    const slot = minutesToTime(start);

    if (isTimeBlocked(start, end)) {
      bookedSlots.push(slot);
    } else {
      availableSlots.push(slot);
    }
  }

  return {
    date,
    serviceId,
    bookedSlots,
    availableSlots,
  };
};
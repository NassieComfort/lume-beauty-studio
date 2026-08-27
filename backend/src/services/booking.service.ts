import Service from "../models/Service";
import Availability from "../models/Availability";
import BlockedSlot from "../models/BlockedSlot";
import Appointment from "../models/Appointment";
import AppError from "../utils/AppError";

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTimeString = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

// Returns an array of available start times ("HH:mm") for a given service and date
export const getAvailableSlots = async (serviceId: string, date: string) => {
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    throw new AppError("Service not found", 404);
  }

  const dayOfWeek = new Date(date).getDay();
  const availability = await Availability.findOne({ dayOfWeek, isActive: true });
  if (!availability) return [];

  const dayStart = toMinutes(availability.startTime);
  const dayEnd = toMinutes(availability.endTime);
  const duration = service.duration;

  const blockedSlots = await BlockedSlot.find({ date });
  const existingAppointments = await Appointment.find({
    date,
    status: { $in: ["pending", "confirmed"] },
  });

  const slots: string[] = [];

  for (let start = dayStart; start + duration <= dayEnd; start += 15) {
    const end = start + duration;

    const overlapsBlocked = blockedSlots.some((b) => {
      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);
      return start < bEnd && end > bStart;
    });

    const overlapsAppointment = existingAppointments.some((a) => {
      const aStart = toMinutes(a.startTime);
      const aEnd = toMinutes(a.endTime);
      return start < aEnd && end > aStart;
    });

    if (!overlapsBlocked && !overlapsAppointment) {
      slots.push(toTimeString(start));
    }
  }

  return slots;
};

// Re-validates availability at booking time to prevent race conditions
export const createAppointment = async (input: {
  serviceId: string;
  date: string;
  startTime: string;
  customerId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}) => {
  const service = await Service.findById(input.serviceId);
  if (!service || !service.isActive) {
    throw new AppError("Service not found", 404);
  }

  const availableSlots = await getAvailableSlots(input.serviceId, input.date);
  if (!availableSlots.includes(input.startTime)) {
    throw new AppError("This time slot is no longer available", 409);
  }

  const endTime = toTimeString(toMinutes(input.startTime) + service.duration);

  const appointment = await Appointment.create({
    service: service._id,
    date: input.date,
    startTime: input.startTime,
    endTime,
    customer: input.customerId,
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    status: "pending",
  });

  return appointment;
};
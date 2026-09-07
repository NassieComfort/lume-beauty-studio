import axios from "axios";

const API_URL = "http://localhost:5000/api/appointments";

// =========================
// TYPES
// =========================

export interface ServiceSummary {
  _id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no-show";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Appointment {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: ServiceSummary;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  price: number;
  depositAmount: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentData {
  serviceId: string;
  date: string;
  startTime: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
}

// =========================
// API METHODS
// =========================

export const createAppointment = async (data: CreateAppointmentData) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getAllAppointments = async (): Promise<{
  success: boolean;
  count: number;
  data: Appointment[];
}> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus
) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const updateAppointmentPayment = async (
  id: string,
  paymentStatus: PaymentStatus
) => {
  const response = await axios.patch(`${API_URL}/${id}/payment`, {
    paymentStatus,
  });
  return response.data;
};

export const cancelAppointment = async (id: string) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`);
  return response.data;
};
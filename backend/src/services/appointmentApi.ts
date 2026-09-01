import axios from "axios";

const API_URL =
  "http://localhost:5000/api/appointments";

export interface CreateAppointmentData {
  serviceId: string;
  date: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const createAppointment = async (
  data: CreateAppointmentData
) => {
  const response = await axios.post(
    API_URL,
    data
  );

  return response.data;
};
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await axios.get(`${API_URL}/services`);

  return response.data.data;
};
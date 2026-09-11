
const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("lume_admin_token");
};

const adminFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
};

export const adminLogin = async (
  email: string,
  password: string
) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

  if (data.data?.user?.role !== "admin") {
    throw new Error(
      "You do not have permission to access the admin dashboard."
    );
  }

  localStorage.setItem(
    "lume_admin_token",
    data.data.token
  );

  localStorage.setItem(
    "lume_admin_user",
    JSON.stringify(data.data.user)
  );

  return data.data;
};

export const adminLogout = () => {
  localStorage.removeItem("lume_admin_token");
  localStorage.removeItem("lume_admin_user");
};

export const getAdminUser = () => {
  const user = localStorage.getItem(
    "lume_admin_user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const updateAdminAccount = async (account: {
  currentPassword: string;
  email: string;
  newPassword?: string;
}) => {
  const response = await adminFetch("/auth/admin-account", {
    method: "PATCH",
    body: JSON.stringify(account),
  });

  if (response.data?.token) {
    localStorage.setItem("lume_admin_token", response.data.token);
    localStorage.setItem("lume_admin_user", JSON.stringify(response.data.user));
  }

  return response;
};

export const getAdminAppointments = async () => {
  return adminFetch("/admin/appointments");
};

export const getAdminAppointment = async (
  id: string
) => {
  return adminFetch(`/admin/appointments/${id}`);
};

export const updateAppointmentStatus = async (
  id: string,
  status: string
) => {
  return adminFetch(`/admin/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
};

export const updateAppointmentPayment = async (
  id: string,
  paymentStatus: string
) => {
  return adminFetch(`/admin/appointments/${id}/payment`, {
    method: "PATCH",
    body: JSON.stringify({ paymentStatus }),
  });
};

export const cancelAppointment = async (
  id: string
) => {
  return adminFetch(
    `/admin/appointments/${id}/cancel`,
    {
      method: "PATCH",
    }
  );
};

export const getAdminServices = async () => {
  return adminFetch("/services");
};

export const createAdminService = async (service: {
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}) => {
  return adminFetch("/services", {
    method: "POST",
    body: JSON.stringify(service),
  });
};

export const updateAdminService = async (
  id: string,
  service: Partial<{
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    isActive: boolean;
  }>
) => {
  return adminFetch(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(service),
  });
};


export const getStudioSettings = async () => {
  return adminFetch("/admin/settings");
};

export const updateStudioSettings = async (settings: {
  studioName?: string;
  email?: string;
  phone?: string;
  address?: string;
  depositPercentage?: number;
  latenessGracePeriod?: number;
  cancellationNoticeHours?: number;
}) => {
  return adminFetch("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
};
export const getAdminAvailability = async () => {
  return adminFetch("/availability");
};

export const updateAdminAvailability = async (availability: {
  dayOfWeek: number;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
}) => {
  return adminFetch("/availability", {
    method: "PUT",
    body: JSON.stringify(availability),
  });
};

export const getAdminBlockedSlots = async () => {
  return adminFetch("/blocked-slots");
};
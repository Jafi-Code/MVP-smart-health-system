const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// ─────────────────────────────────────────────
// TOKEN STORAGE
// ─────────────────────────────────────────────
const ACCESS_TOKEN_KEY = "shs_patient_access_token";
const REFRESH_TOKEN_KEY = "shs_patient_refresh_token";
const USER_KEY = "shs_patient_user";

export const auth = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  save: (data: { accessToken: string; refreshToken: string; user: any }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ─────────────────────────────────────────────
// FETCH WRAPPER
// ─────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = auth.getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const message = json?.error?.message || "Request failed";
    const code = json?.error?.code || "UNKNOWN";
    throw new ApiError(message, code, res.status);
  }

  return json.data as T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─────────────────────────────────────────────
// API METHODS
// ─────────────────────────────────────────────
export const api = {
  // Auth
  register: (data: {
    name: string;
    phone: string;
    idNumber?: string;
    password: string;
  }) =>
    request<{ user: any; accessToken: string; refreshToken: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) },
    ),

  login: (identifier: string, password: string) =>
    request<{ user: any; accessToken: string; refreshToken: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ identifier, password }) },
    ),

  me: () => request<{ user: any }>("/auth/me"),

  // Clinics
  listClinics: () => request<{ clinics: Clinic[] }>("/clinics"),

  // Appointments
  bookAppointment: (data: {
    clinicId: string;
    date: string;
    time: string;
    reason?: string;
  }) =>
    request<{ appointment: Appointment }>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyAppointments: () =>
    request<{ appointments: Appointment[] }>("/appointments/me"),

  getClinicQueue: (clinicId: string, date?: string) =>
    request<{ date: string; stats: QueueStats; appointments: QueueItem[] }>(
      `/appointments/queue/${clinicId}${date ? `?date=${date}` : ""}`,
    ),
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_CONSULTATION"
  | "DONE"
  | "CANCELLED"
  | "NO_SHOW";

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  operatingHours?: Record<string, any>;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason?: string;
  status: AppointmentStatus;
  queuePosition?: number;
  clinic: {
    id: string;
    name: string;
    address?: string;
  };
}

export interface QueueItem {
  id: string;
  time: string;
  status: AppointmentStatus;
  queuePosition?: number;
  patient: {
    id: string;
    name: string;
  };
}

export interface QueueStats {
  total: number;
  scheduled: number;
  checkedIn: number;
  inConsultation: number;
  done: number;
}

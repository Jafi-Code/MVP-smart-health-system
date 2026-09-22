const API_BASE = "http://localhost:3000/api/v1";

// ─────────────────────────────────────────────
// TOKEN STORAGE
// ─────────────────────────────────────────────
const ACCESS_TOKEN_KEY = "shs_access_token";
const REFRESH_TOKEN_KEY = "shs_refresh_token";
const USER_KEY = "shs_user";

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
  login: (identifier: string, password: string) =>
    request<{ user: any; accessToken: string; refreshToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      },
    ),

  me: () => request<{ user: any }>("/auth/me"),

  // Staff
  getTodayAppointments: () =>
    request<{ appointments: Appointment[] }>("/clinic/appointments"),

  updateStatus: (id: string, status: AppointmentStatus) =>
    request<{ appointment: Appointment }>(`/clinic/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Public
  getClinicQueue: (clinicId: string) =>
    request<{ date: string; stats: QueueStats; appointments: Appointment[] }>(
      `/appointments/queue/${clinicId}`,
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

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason?: string;
  status: AppointmentStatus;
  queuePosition?: number;
  patient: {
    id: string;
    name: string;
    phone?: string;
  };
  clinic: {
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

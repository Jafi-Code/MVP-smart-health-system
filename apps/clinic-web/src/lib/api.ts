const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

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
// FETCH WRAPPER (with auto-refresh on 401)
// ─────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
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

  // Auto-refresh on 401
  if (res.status === 401 && !isRetry) {
    const refreshToken = auth.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const newAccessToken = refreshJson.data.accessToken;
          const currentUser = auth.getUser();
          auth.save({
            accessToken: newAccessToken,
            refreshToken,
            user: currentUser,
          });
          return request<T>(path, options, true);
        }
      } catch {
        // fall through
      }
    }
    auth.clear();
    window.location.href = "/login";
    throw new ApiError("Session expired", "UNAUTHORIZED", 401);
  }

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
      { method: "POST", body: JSON.stringify({ identifier, password }) },
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

  // ─────────────────────────────────────────────
  // REPORTS (MANAGER ONLY)
  // ─────────────────────────────────────────────
  getDailyReport: (date?: string) =>
    request<DailyReport>(`/clinic/reports/daily${date ? `?date=${date}` : ""}`),

  downloadDailyReportCSV: async (date?: string) => {
    const token = auth.getAccessToken();
    const url = `${API_BASE}/clinic/reports/daily/export${
      date ? `?date=${date}` : ""
    }`;

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new ApiError(
        "Failed to download report",
        "DOWNLOAD_FAILED",
        res.status,
      );
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `shs-report-${date || "today"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_VITALS"
  | "IN_CONSULTATION"
  | "AWAITING_MEDICATION"
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

// ─────────────────────────────────────────────
// REPORT TYPES
// ─────────────────────────────────────────────
export interface DailyReportSummary {
  totalAppointments: number;
  completed: number;
  noShows: number;
  cancelled: number;
  stillWaiting: number;
  noShowRate: number;
  completionRate: number;
}

export interface DailyReportWaitTimes {
  averageTotalMinutes: number;
  averageTriageToConsultMinutes: number;
  averageConsultToDoneMinutes: number;
}

export interface DailyReportStation {
  station: string;
  patientsProcessed: number;
}

export interface DailyReportTimelineItem {
  appointmentId: string;
  patientName: string;
  scheduledTime: string;
  status: string;
  checkedInAt: string | null;
  consultationStartedAt: string | null;
  completedAt: string | null;
  totalMinutes: number | null;
}

export interface DailyReport {
  date: string;
  clinicId: string;
  clinicName: string;
  summary: DailyReportSummary;
  waitTimes: DailyReportWaitTimes;
  stationActivity: DailyReportStation[];
  timeline: DailyReportTimelineItem[];
}

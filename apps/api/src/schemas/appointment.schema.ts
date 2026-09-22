import { z } from "zod";

// ─────────────────────────────────────────────
// BOOK APPOINTMENT
// ─────────────────────────────────────────────

export const bookAppointmentSchema = z.object({
  clinicId: z.string().min(1, "Clinic is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  reason: z.string().max(500).optional(),
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

// ─────────────────────────────────────────────
// UPDATE APPOINTMENT STATUS (staff)
// ─────────────────────────────────────────────

export const updateStatusSchema = z.object({
  status: z.enum([
    "CHECKED_IN",
    "IN_VITALS",
    "IN_CONSULTATION",
    "AWAITING_MEDICATION",
    "DONE",
    "NO_SHOW",
    "CANCELLED",
  ]),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export const dailyReportQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
});

export type DailyReportQuery = z.infer<typeof dailyReportQuerySchema>;

import { prisma } from "../lib/prisma.js";
import type {
  BookAppointmentInput,
  UpdateStatusInput,
} from "../schemas/appointment.schema.js";

export class AppointmentError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AppointmentError";
  }
}

function getLocalDayStart(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

function parseLocalDayDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date(NaN);
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function formatLocalDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesBetween(start: Date | null, end: Date | null) {
  if (!start || !end) return null;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

function average(values: Array<number | null>) {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return 0;
  return Math.round(
    available.reduce((total, value) => total + value, 0) / available.length,
  );
}

// ─────────────────────────────────────────────
// BOOK APPOINTMENT
// ─────────────────────────────────────────────

export async function bookAppointment(
  patientId: string,
  input: BookAppointmentInput,
) {
  // Verify clinic exists
  const clinic = await prisma.clinic.findUnique({
    where: { id: input.clinicId },
  });

  if (!clinic) {
    throw new AppointmentError("CLINIC_NOT_FOUND", "Clinic not found", 404);
  }

  // Parse date (store as UTC midnight)
  const appointmentDate = parseLocalDayDate(input.date);

  if (isNaN(appointmentDate.getTime())) {
    throw new AppointmentError("INVALID_DATE", "Invalid date", 400);
  }

  // Prevent booking in the past
  const today = getLocalDayStart();
  if (appointmentDate < today) {
    throw new AppointmentError(
      "PAST_DATE",
      "Cannot book appointments in the past",
      400,
    );
  }

  // Check for existing booking at the same time
  const conflict = await prisma.appointment.findFirst({
    where: {
      clinicId: input.clinicId,
      date: appointmentDate,
      time: input.time,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
  });

  if (conflict) {
    throw new AppointmentError(
      "SLOT_TAKEN",
      "This time slot is already booked. Please choose another.",
      409,
    );
  }

  // Calculate queue position (count of appointments earlier that day)
  const earlierCount = await prisma.appointment.count({
    where: {
      clinicId: input.clinicId,
      date: appointmentDate,
      time: { lt: input.time },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
  });

  const queuePosition = earlierCount + 1;

  // Create the appointment
  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      clinicId: input.clinicId,
      date: appointmentDate,
      time: input.time,
      reason: input.reason,
      status: "SCHEDULED",
      queuePosition,
    },
    include: {
      clinic: { select: { id: true, name: true, address: true } },
    },
  });

  return appointment;
}

// ─────────────────────────────────────────────
// GET MY APPOINTMENTS
// ─────────────────────────────────────────────

export async function getMyAppointments(patientId: string) {
  return prisma.appointment.findMany({
    where: { patientId },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    include: {
      clinic: { select: { id: true, name: true, address: true } },
    },
  });
}

// ─────────────────────────────────────────────
// GET CLINIC QUEUE
// ─────────────────────────────────────────────

export async function getClinicQueue(clinicId: string, date?: string) {
  const targetDate = date ? parseLocalDayDate(date) : getLocalDayStart();

  const appointments = await prisma.appointment.findMany({
    where: {
      clinicId,
      date: targetDate,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
    orderBy: { time: "asc" },
    include: {
      patient: {
        select: { id: true, name: true, phone: true },
      },
    },
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "SCHEDULED").length,
    checkedIn: appointments.filter((a) => a.status === "CHECKED_IN").length,
    inConsultation: appointments.filter((a) => a.status === "IN_CONSULTATION")
      .length,
    done: appointments.filter((a) => a.status === "DONE").length,
  };

  return { date: targetDate.toISOString().split("T")[0], stats, appointments };
}

// ─────────────────────────────────────────────
// GET TODAY'S APPOINTMENTS (staff)
// ─────────────────────────────────────────────

export async function getTodayAppointments(
  clinicId: string,
  station?: "NONE" | "RECEPTION" | "TRIAGE" | "CONSULTATION" | "PHARMACY",
) {
  const today = getLocalDayStart();

  const statusByStation: Record<
    string,
    Array<
      | "SCHEDULED"
      | "CHECKED_IN"
      | "IN_VITALS"
      | "IN_CONSULTATION"
      | "AWAITING_MEDICATION"
      | "DONE"
      | "CANCELLED"
      | "NO_SHOW"
    >
  > = {
    RECEPTION: ["SCHEDULED", "CHECKED_IN"],
    TRIAGE: ["CHECKED_IN", "IN_VITALS"],
    CONSULTATION: ["IN_VITALS", "IN_CONSULTATION"],
    PHARMACY: ["AWAITING_MEDICATION"],
    NONE: [
      "SCHEDULED",
      "CHECKED_IN",
      "IN_VITALS",
      "IN_CONSULTATION",
      "AWAITING_MEDICATION",
      "DONE",
    ],
  };

  const allowedStatuses =
    statusByStation[station ?? "NONE"] || statusByStation.NONE;

  return prisma.appointment.findMany({
    where: {
      clinicId,
      date: today,
      status: { in: allowedStatuses },
    },
    orderBy: { time: "asc" },
    include: {
      patient: { select: { id: true, name: true, phone: true } },
    },
  });
}

// -----------------------------------------------------------------------------
// DAILY MANAGER REPORT
// -----------------------------------------------------------------------------

export async function getDailyReport(clinicId: string, date?: string) {
  const targetDate = date ? parseLocalDayDate(date) : getLocalDayStart();
  if (Number.isNaN(targetDate.getTime())) {
    throw new AppointmentError("INVALID_DATE", "Invalid report date", 400);
  }

  const [clinic, appointments] = await Promise.all([
    prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { id: true, name: true },
    }),
    prisma.appointment.findMany({
      where: { clinicId, date: targetDate },
      orderBy: { time: "asc" },
      include: { patient: { select: { name: true, phone: true } } },
    }),
  ]);

  if (!clinic) {
    throw new AppointmentError("CLINIC_NOT_FOUND", "Clinic not found", 404);
  }

  const completed = appointments.filter(
    (appointment) => appointment.status === "DONE",
  );
  const noShows = appointments.filter(
    (appointment) => appointment.status === "NO_SHOW",
  );
  const cancelled = appointments.filter(
    (appointment) => appointment.status === "CANCELLED",
  );
  const waiting = appointments.filter((appointment) =>
    [
      "SCHEDULED",
      "CHECKED_IN",
      "IN_VITALS",
      "IN_CONSULTATION",
      "AWAITING_MEDICATION",
    ].includes(appointment.status),
  );
  const total = appointments.length;

  const timeline = appointments.map((appointment) => ({
    appointmentId: appointment.id,
    patientName: appointment.patient.name,
    phone: appointment.patient.phone,
    scheduledTime: appointment.time,
    status: appointment.status,
    checkedInAt: appointment.checkedInAt?.toISOString() ?? null,
    consultationStartedAt:
      appointment.consultationStartedAt?.toISOString() ?? null,
    completedAt: appointment.completedAt?.toISOString() ?? null,
    totalMinutes: minutesBetween(
      appointment.checkedInAt,
      appointment.completedAt,
    ),
  }));

  return {
    date: formatLocalDay(targetDate),
    clinicId: clinic.id,
    clinicName: clinic.name,
    summary: {
      totalAppointments: total,
      completed: completed.length,
      noShows: noShows.length,
      cancelled: cancelled.length,
      stillWaiting: waiting.length,
      noShowRate: total ? Math.round((noShows.length / total) * 1000) / 10 : 0,
      completionRate: total
        ? Math.round((completed.length / total) * 1000) / 10
        : 0,
    },
    waitTimes: {
      averageTotalMinutes: average(
        completed.map((appointment) =>
          minutesBetween(appointment.checkedInAt, appointment.completedAt),
        ),
      ),
      averageTriageToConsultMinutes: average(
        appointments.map((appointment) =>
          minutesBetween(
            appointment.checkedInAt,
            appointment.consultationStartedAt,
          ),
        ),
      ),
      averageConsultToDoneMinutes: average(
        completed.map((appointment) =>
          minutesBetween(
            appointment.consultationStartedAt,
            appointment.completedAt,
          ),
        ),
      ),
    },
    stationActivity: [
      {
        station: "RECEPTION",
        patientsProcessed: appointments.filter(
          (appointment) =>
            !["SCHEDULED", "CANCELLED", "NO_SHOW"].includes(appointment.status),
        ).length,
      },
      {
        station: "TRIAGE",
        patientsProcessed: appointments.filter((appointment) =>
          [
            "IN_VITALS",
            "IN_CONSULTATION",
            "AWAITING_MEDICATION",
            "DONE",
          ].includes(appointment.status),
        ).length,
      },
      {
        station: "CONSULTATION",
        patientsProcessed: appointments.filter((appointment) =>
          ["IN_CONSULTATION", "AWAITING_MEDICATION", "DONE"].includes(
            appointment.status,
          ),
        ).length,
      },
      { station: "PHARMACY", patientsProcessed: completed.length },
    ],
    timeline,
  };
}

// ─────────────────────────────────────────────
// UPDATE APPOINTMENT STATUS (staff)
// ─────────────────────────────────────────────

export async function updateAppointmentStatus(
  appointmentId: string,
  staffClinicId: string | null | undefined,
  input: UpdateStatusInput,
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppointmentError("NOT_FOUND", "Appointment not found", 404);
  }

  // Staff can only update appointments in their own clinic
  if (staffClinicId && appointment.clinicId !== staffClinicId) {
    throw new AppointmentError(
      "FORBIDDEN",
      "You can only manage appointments in your assigned clinic",
      403,
    );
  }

  // Timestamps based on status
  const now = new Date();
  const data: Record<string, unknown> = { status: input.status };

  if (input.status === "CHECKED_IN" && !appointment.checkedInAt) {
    data.checkedInAt = now;
  }
  if (input.status === "IN_VITALS") {
    data.checkedInAt = appointment.checkedInAt ?? now;
  }
  if (
    input.status === "IN_CONSULTATION" &&
    !appointment.consultationStartedAt
  ) {
    data.consultationStartedAt = now;
  }
  if (input.status === "AWAITING_MEDICATION") {
    data.consultationStartedAt = appointment.consultationStartedAt ?? now;
  }
  if (input.status === "DONE" && !appointment.completedAt) {
    data.completedAt = now;
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data,
    include: {
      patient: { select: { id: true, name: true, phone: true } },
      clinic: { select: { id: true, name: true } },
    },
  });
}

// ─────────────────────────────────────────────
// LIST CLINICS (public)
// ─────────────────────────────────────────────

export async function listClinics() {
  return prisma.clinic.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      operatingHours: true,
    },
  });
}

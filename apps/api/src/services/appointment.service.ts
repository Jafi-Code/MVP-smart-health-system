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
  const appointmentDate = new Date(`${input.date}T00:00:00.000Z`);

  if (isNaN(appointmentDate.getTime())) {
    throw new AppointmentError("INVALID_DATE", "Invalid date", 400);
  }

  // Prevent booking in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
  const targetDate = date
    ? new Date(`${date}T00:00:00.000Z`)
    : new Date(new Date().toISOString().split("T")[0] + "T00:00:00.000Z");

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

export async function getTodayAppointments(clinicId: string) {
  const today = new Date(
    new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
  );

  return prisma.appointment.findMany({
    where: { clinicId, date: today },
    orderBy: { time: "asc" },
    include: {
      patient: { select: { id: true, name: true, phone: true } },
    },
  });
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
  if (
    input.status === "IN_CONSULTATION" &&
    !appointment.consultationStartedAt
  ) {
    data.consultationStartedAt = now;
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

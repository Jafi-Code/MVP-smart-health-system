import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  bookAppointmentSchema,
  dailyReportQuerySchema,
  updateStatusSchema,
} from "../schemas/appointment.schema.js";
import {
  bookAppointment,
  getMyAppointments,
  getClinicQueue,
  getTodayAppointments,
  getDailyReport,
  updateAppointmentStatus,
  listClinics,
  AppointmentError,
} from "../services/appointment.service.js";

// ─────────────────────────────────────────────
// HELPER: role check
// ─────────────────────────────────────────────
const STAFF_ROLES = ["RECEPTIONIST", "NURSE", "MANAGER", "ADMIN"];

function isStaff(role: string) {
  return STAFF_ROLES.includes(role);
}

function isManager(role: string) {
  return role === "MANAGER" || role === "ADMIN";
}

// ─────────────────────────────────────────────
// PUBLIC + PATIENT ROUTES  →  /api/v1
// ─────────────────────────────────────────────
export const appointmentRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  // GET /api/v1/clinics (public)
  app.get("/clinics", async (_request, reply) => {
    const clinics = await listClinics();
    return reply.send({ success: true, data: { clinics } });
  });

  // POST /api/v1/appointments (patient)
  app.post(
    "/appointments",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const parsed = bookAppointmentSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(422).send({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: parsed.error.issues.map((i) => ({
              field: i.path.join("."),
              message: i.message,
            })),
          },
        });
      }

      try {
        const appointment = await bookAppointment(
          request.user.sub,
          parsed.data,
        );
        return reply.status(201).send({ success: true, data: { appointment } });
      } catch (error) {
        if (error instanceof AppointmentError) {
          return reply.status(error.statusCode).send({
            success: false,
            error: { code: error.code, message: error.message },
          });
        }
        throw error;
      }
    },
  );

  // GET /api/v1/appointments/me (patient)
  app.get(
    "/appointments/me",
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const appointments = await getMyAppointments(request.user.sub);
      return reply.send({ success: true, data: { appointments } });
    },
  );

  // GET /api/v1/appointments/queue/:clinicId (public)
  app.get<{ Params: { clinicId: string }; Querystring: { date?: string } }>(
    "/appointments/queue/:clinicId",
    async (request, reply) => {
      try {
        const queue = await getClinicQueue(
          request.params.clinicId,
          request.query.date,
        );
        return reply.send({ success: true, data: queue });
      } catch (error) {
        if (error instanceof AppointmentError) {
          return reply.status(error.statusCode).send({
            success: false,
            error: { code: error.code, message: error.message },
          });
        }
        throw error;
      }
    },
  );
};

// ─────────────────────────────────────────────
// STAFF-ONLY ROUTES  →  /api/v1/clinic
// ─────────────────────────────────────────────
export const clinicRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  // Role guard for all /clinic/* routes
  app.addHook("onRequest", async (request, reply) => {
    await app.authenticate(request, reply);
    if (!isStaff(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "Staff access required" },
      });
    }
  });

  app.get("/reports/daily", async (request, reply) => {
    if (!isManager(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "Manager access required" },
      });
    }
    if (!request.user.clinicId) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "NO_CLINIC_ASSIGNED",
          message: "You are not assigned to a clinic",
        },
      });
    }

    const parsed = dailyReportQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(422).send({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid report date" },
      });
    }

    const report = await getDailyReport(
      request.user.clinicId,
      parsed.data.date,
    );
    return reply.send({ success: true, data: report });
  });

  app.get("/reports/daily/export", async (request, reply) => {
    if (!isManager(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: { code: "FORBIDDEN", message: "Manager access required" },
      });
    }
    if (!request.user.clinicId) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "NO_CLINIC_ASSIGNED",
          message: "You are not assigned to a clinic",
        },
      });
    }

    const parsed = dailyReportQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(422).send({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid report date" },
      });
    }

    const report = await getDailyReport(
      request.user.clinicId,
      parsed.data.date,
    );
    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      [
        "Patient Name",
        "Phone",
        "Scheduled Time",
        "Status",
        "Checked In At",
        "Consult Started At",
        "Completed At",
        "Total Minutes",
      ],
      ...report.timeline.map((entry) => [
        entry.patientName,
        entry.phone,
        entry.scheduledTime,
        entry.status,
        entry.checkedInAt,
        entry.consultationStartedAt,
        entry.completedAt,
        entry.totalMinutes,
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    return reply
      .header("Content-Type", "text/csv; charset=utf-8")
      .header(
        "Content-Disposition",
        `attachment; filename="shs-report-${report.date}.csv"`,
      )
      .send(csv);
  });

  // GET /api/v1/clinic/appointments (staff)
  app.get("/appointments", async (request, reply) => {
    if (!request.user.clinicId) {
      return reply.status(400).send({
        success: false,
        error: {
          code: "NO_CLINIC_ASSIGNED",
          message: "You are not assigned to a clinic",
        },
      });
    }

    const appointments = await getTodayAppointments(
      request.user.clinicId,
      request.user.station,
    );
    return reply.send({ success: true, data: { appointments } });
  });

  // PATCH /api/v1/clinic/appointments/:id/status (staff)
  app.patch<{ Params: { id: string } }>(
    "/appointments/:id/status",
    async (request, reply) => {
      const parsed = updateStatusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(422).send({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid status",
            details: parsed.error.issues.map((i) => ({
              field: i.path.join("."),
              message: i.message,
            })),
          },
        });
      }

      try {
        const appointment = await updateAppointmentStatus(
          request.params.id,
          request.user.clinicId,
          parsed.data,
        );
        return reply.send({ success: true, data: { appointment } });
      } catch (error) {
        if (error instanceof AppointmentError) {
          return reply.status(error.statusCode).send({
            success: false,
            error: { code: error.code, message: error.message },
          });
        }
        throw error;
      }
    },
  );
};

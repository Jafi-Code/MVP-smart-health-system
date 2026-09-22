import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  bookAppointmentSchema,
  updateStatusSchema,
} from "../schemas/appointment.schema.js";
import {
  bookAppointment,
  getMyAppointments,
  getClinicQueue,
  getTodayAppointments,
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

    const appointments = await getTodayAppointments(request.user.clinicId);
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

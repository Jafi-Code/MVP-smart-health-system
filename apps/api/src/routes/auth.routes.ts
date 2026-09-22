import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../schemas/auth.schema.js";
import {
  registerPatient,
  loginUser,
  getUserById,
  AuthError,
} from "../services/auth.service.js";

const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // ─────────────────────────────────────────────
  // POST /api/v1/auth/register
  // ─────────────────────────────────────────────
  app.post("/register", async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(422).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
    }

    try {
      const user = await registerPatient(parsed.data);

      const accessToken = app.jwt.sign(
        { sub: user.id, role: user.role, clinicId: user.clinicId },
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" },
      );

      const refreshToken = app.jwt.sign(
        { sub: user.id, role: user.role, clinicId: user.clinicId },
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" },
      );

      return reply.status(201).send({
        success: true,
        data: { user, accessToken, refreshToken },
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }
      throw error;
    }
  });

  // ─────────────────────────────────────────────
  // POST /api/v1/auth/login
  // ─────────────────────────────────────────────
  app.post("/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(422).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
    }

    try {
      const user = await loginUser(parsed.data);

      const accessToken = app.jwt.sign(
        { sub: user.id, role: user.role, clinicId: user.clinicId },
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" },
      );

      const refreshToken = app.jwt.sign(
        { sub: user.id, role: user.role, clinicId: user.clinicId },
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" },
      );

      return reply.send({
        success: true,
        data: { user, accessToken, refreshToken },
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }
      throw error;
    }
  });

  // ─────────────────────────────────────────────
  // GET /api/v1/auth/me (protected)
  // ─────────────────────────────────────────────
  app.get("/me", { onRequest: [app.authenticate] }, async (request, reply) => {
    try {
      const user = await getUserById(request.user.sub);
      return reply.send({ success: true, data: { user } });
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }
      throw error;
    }
  });

  // ─────────────────────────────────────────────
  // POST /api/v1/auth/refresh
  // ─────────────────────────────────────────────
  app.post("/refresh", async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(422).send({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
    }

    try {
      const decoded = app.jwt.verify<{
        sub: string;
        role: "PATIENT" | "RECEPTIONIST" | "NURSE" | "MANAGER" | "ADMIN";
        clinicId?: string | null;
      }>(parsed.data.refreshToken);

      const accessToken = app.jwt.sign(
        { sub: decoded.sub, role: decoded.role, clinicId: decoded.clinicId },
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" },
      );

      return reply.send({ success: true, data: { accessToken } });
    } catch {
      return reply.status(401).send({
        success: false,
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "Invalid or expired refresh token",
        },
      });
    }
  });
};

export default authRoutes;

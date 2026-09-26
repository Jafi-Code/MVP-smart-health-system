import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";

import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import {
  appointmentRoutes,
  clinicRoutes,
} from "./routes/appointment.routes.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

// ─────────────────────────────────────────────
// AUTH DECORATOR
// ─────────────────────────────────────────────
app.decorate("authenticate", async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────
app.setErrorHandler((error: any, _request, reply) => {
  app.log.error(error);

  // Prisma connection pool errors → 503 quickly
  if (
    error?.name === "PrismaClientKnownRequestError" &&
    error?.code === "P2024"
  ) {
    return reply.status(503).send({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Database temporarily unavailable. Please try again.",
      },
    });
  }

  // Generic 500
  if (error?.statusCode === undefined || error.statusCode >= 500) {
    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    });
  }

  // 4xx errors pass through
  return reply.send(error);
});

// ─────────────────────────────────────────────
// HEALTH ROUTES (public, no DB needed)
// ─────────────────────────────────────────────
app.get("/health", async () => ({
  status: "ok",
  service: "shs-api",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: process.env.NODE_ENV,
}));

app.get("/health/db", async (_request, reply) => {
  try {
    const [clinicCount, userCount, appointmentCount] = await Promise.all([
      prisma.clinic.count(),
      prisma.user.count(),
      prisma.appointment.count(),
    ]);

    return {
      status: "ok",
      database: "connected",
      counts: {
        clinics: clinicCount,
        users: userCount,
        appointments: appointmentCount,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    app.log.error(error);
    return reply.status(503).send({
      status: "error",
      database: "disconnected",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/", async () => ({
  name: "Smart Health System API",
  version: "0.1.0",
  description: "Offline-first patient flow management platform",
  endpoints: {
    health: "/health",
    databaseHealth: "/health/db",
    auth: {
      register: "POST /api/v1/auth/register",
      login: "POST /api/v1/auth/login",
      refresh: "POST /api/v1/auth/refresh",
      me: "GET /api/v1/auth/me",
    },
    clinics: "GET /api/v1/clinics",
    appointments: {
      book: "POST /api/v1/appointments",
      mine: "GET /api/v1/appointments/me",
      queue: "GET /api/v1/appointments/queue/:clinicId",
    },
    staff: {
      today: "GET /api/v1/clinic/appointments",
      updateStatus: "PATCH /api/v1/clinic/appointments/:id/status",
    },
  },
}));

// ─────────────────────────────────────────────
// PLUGINS + ROUTES + LISTEN
// ─────────────────────────────────────────────
async function start() {
  try {
    // 1. Plugins
    await app.register(helmet, { contentSecurityPolicy: false });

    await app.register(cors, {
      origin: process.env.CORS_ORIGIN?.split(",") ?? true,
      credentials: true,
    });

    await app.register(jwt, {
      secret: process.env.JWT_SECRET || "fallback-dev-secret-change-me",
      sign: { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" },
    });

    // 2. Routes
    await app.register(authRoutes, { prefix: "/api/v1/auth" });
    await app.register(appointmentRoutes, { prefix: "/api/v1" });
    await app.register(clinicRoutes, { prefix: "/api/v1/clinic" });

    // 3. Listen
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`SHS API running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

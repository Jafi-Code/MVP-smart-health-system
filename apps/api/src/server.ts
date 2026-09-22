import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// Create Fastify instance
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

// Register plugins
async function registerPlugins() {
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(",") || true,
    credentials: true,
  });
}

// Health check endpoint
app.get("/health", async () => {
  return {
    status: "ok",
    service: "shs-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };
});

// Root endpoint
app.get("/", async () => {
  return {
    name: "Smart Health System API",
    version: "0.1.0",
    description: "Offline-first patient flow management platform",
    endpoints: {
      health: "/health",
      databaseHealth: "/health/db",
    },
  };
});

// Database health check
app.get("/health/db", async (_request, reply) => {
  try {
    const clinicCount = await prisma.clinic.count();
    const userCount = await prisma.user.count();
    const appointmentCount = await prisma.appointment.count();

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
    return reply.status(500).send({
      status: "error",
      database: "disconnected",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Start server
async function start() {
  try {
    await registerPlugins();
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`SHS API running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

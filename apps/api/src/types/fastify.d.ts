import "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

type AuthUser = {
  sub: string;
  role: "PATIENT" | "RECEPTIONIST" | "NURSE" | "MANAGER" | "ADMIN";
  station: "NONE" | "RECEPTION" | "TRIAGE" | "CONSULTATION" | "PHARMACY";
  clinicId?: string | null;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: AuthUser;
    payload: AuthUser;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: "PATIENT" | "RECEPTIONIST" | "NURSE" | "MANAGER" | "ADMIN";
      clinicId?: string | null;
    };
    user: {
      sub: string;
      role: "PATIENT" | "RECEPTIONIST" | "NURSE" | "MANAGER" | "ADMIN";
      clinicId?: string | null;
    };
  }
}

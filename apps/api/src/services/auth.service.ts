import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

const SALT_ROUNDS = 12;

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export async function registerPatient(input: RegisterInput) {
  // Check for existing user by phone
  const existingByPhone = await prisma.user.findUnique({
    where: { phone: input.phone },
  });

  if (existingByPhone) {
    throw new AuthError(
      "PHONE_TAKEN",
      "An account with this phone number already exists",
      409,
    );
  }

  // Check for existing user by ID number (if provided)
  if (input.idNumber) {
    const existingById = await prisma.user.findUnique({
      where: { idNumber: input.idNumber },
    });

    if (existingById) {
      throw new AuthError(
        "ID_TAKEN",
        "An account with this ID number already exists",
        409,
      );
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: input.name,
      phone: input.phone,
      idNumber: input.idNumber,
      passwordHash,
      role: "PATIENT",
      station: "NONE",
    },
    select: {
      id: true,
      name: true,
      phone: true,
      idNumber: true,
      email: true,
      role: true,
      station: true,
      clinicId: true,
      createdAt: true,
    },
  });

  return user;
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export async function loginUser(input: LoginInput) {
  const { identifier, password } = input;

  // Look up by phone OR email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });

  if (!user) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials", 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials", 401);
  }

  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    station: user.station,
    clinicId: user.clinicId,
  };
}

// ─────────────────────────────────────────────
// GET USER BY ID
// ─────────────────────────────────────────────

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      idNumber: true,
      role: true,
      station: true,
      clinicId: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AuthError("USER_NOT_FOUND", "User not found", 404);
  }

  return user;
}

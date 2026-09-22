import { z } from "zod";

// ─────────────────────────────────────────────
// REGISTER (patients)
// ─────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(
      /^0[0-9]{9}$/,
      "Phone must be 10 digits starting with 0 (e.g., 0821234567)",
    ),
  idNumber: z
    .string()
    .regex(/^[0-9]{13}$/, "ID number must be exactly 13 digits")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────────
// LOGIN (patients + staff)
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: z.string().min(3, "Please enter your phone or email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────
// REFRESH
// ─────────────────────────────────────────────

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, "Refresh token is required"),
});

export type RefreshInput = z.infer<typeof refreshSchema>;

import { z, ZodType } from "zod";

export interface CreateUserReq {
  username: string;
  email: string;
  password: string;
}

export interface UserRes {
  id: string;
  username: string;
  email: string;
}

export interface UpdateUserReq {
  id: string;
  username?: string;
  email?: string;
}

export const createUserSchema: ZodType = z.object({
  username: z
    .string({
      error: "Username harus berupa string",
    })
    .min(3, {
      error: "Username minimal 3 karakter",
    })
    .max(100, {
      error: "Username maksimal 100 karakter",
    }),
  email: z.email({
    error: "Format email tidak valid",
  }),
  password: z
    .string({
      error: "Password harus berupa string",
    })
    .min(8, {
      error: "Password minimal 8 karakter",
    }),
});

export const updateUserSchema: ZodType = z.object({
  username: z
    .string({
      error: "Username harus berupa string",
    })
    .min(3, {
      error: "Username minimal 3 karakter",
    })
    .max(100, {
      error: "Username maksimal 100 karakter",
    })
    .optional(),
  email: z
    .email({
      error: "Format email tidak valid",
    })
    .optional(),
});

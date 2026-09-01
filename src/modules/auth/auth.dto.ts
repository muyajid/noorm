import { z, ZodType } from "zod";

export interface LoginReq {
    username: string;
    password: string;
}

export interface LoginRes {
    accesToken: string;
}

export const loginSchema: ZodType = z.object({
    username: z.string({
        error: 'Username wajib diisi'
    }),
    password: z.string({
        error: 'Password wajib diisi'
    })
});
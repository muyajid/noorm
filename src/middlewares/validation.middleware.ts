import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { createError } from "../exceptions/error.exception";

export const validateRequest = (schema: ZodType) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return next(createError(400, "Validasi data gagal", errors));
    }

    req.body = result.data;

    next();
  };
};

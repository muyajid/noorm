import { NextFunction, Response } from "express";
import { AuthRequest, verifAuthToken } from "../utils/token.util";
import { createError } from "../exceptions/error.exception";

export const authMiddleware = (
  req: AuthRequest,
  _: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return next(createError(400, "Token autentikasi dibutuhkan"));
    }

    if (!header?.startsWith("Bearer ")) {
      return next(
        createError(400, "Format token tidak valid gunakan Beaerer <token>"),
      );
    }

    const bearer = header.split(" ")[1];

    if (!bearer) {
      return next(createError(400, "Token jwt dibutuhkan"));
    }

    const verif = verifAuthToken(bearer);

    if (!verif || verif == null) {
      return next(createError(400, "Token salah atau kadaluwarsa"));
    }

    req.user = verif;
    console.info(`Welcome ${verif.username}`);

    next();
  } catch (error: any) {
    console.error(`Error on auth middleware: ${error.message}`);
    throw error;
  }
};

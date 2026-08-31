import { NextFunction, Request, Response } from "express";
import { isAppEror } from "./error.exception";

export function errorHandler(
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (isAppEror(err)) {
    return res.status(err.statusCode || 900).json({
      status: err.status,
      message: err.message,
      errors: err.error || null,
    });
  }

  console.error(`[ERROR] Internal server eror - ${err.message}`);
  return res.status(500).json({
    status: "failed",
    statusCode: 500,
    message: "Terjadi kesalahan pada server",
  });
}

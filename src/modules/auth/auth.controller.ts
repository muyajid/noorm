import { NextFunction, Request, Response } from "express";
import { authLogin } from "./auth.service";
import { createNewUser } from "../user/user.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authLogin(req.body);

    return res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createNewUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Akun berhasil dibuat",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

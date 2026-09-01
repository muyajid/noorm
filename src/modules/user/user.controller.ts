import { NextFunction, Request, Response } from "express";
import { getAllUser, getUserById, updateUserById } from "./user.service";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllUser();

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await getUserById(id as string);

    res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const upadateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await updateUserById({id, ...req.body});

    res.status(200).json({
      status: "success",
      message: "Berhasil merubah data pengguna",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
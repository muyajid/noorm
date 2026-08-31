import { NextFunction, Request, Response } from "express";
import { getUserFromJwt } from "../../utils/token.util";
import {
  createPostById,
  deletePostById,
  getAllPost,
  updatePostById,
} from "./post.service";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getUserFromJwt(req);
    const result = await createPostById({ user_id: id, ...req.body });

    return res.status(201).json({
      status: "success",
      message: "Berhasil menambah postingan",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;

    const result = await getAllPost(page, limit);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data postingan",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await deletePostById(id as string);

    return res.status(200).json({
      status: "success",
      message: "Berhasil menghapus postingan",
    });
  } catch (error: any) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await updatePostById({ id, ...req.body });

    return res.status(200).json({
      status: "success",
      message: "Postingan berhasil diupdate",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
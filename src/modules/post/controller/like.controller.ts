import { NextFunction, Request, Response } from "express";
import { getUserFromJwt } from "../../../utils/token.util";
import { likePostById, unLikePostById } from "../services/like.service";

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getUserFromJwt(req);
    const { postId } = req.params;

    await likePostById({
      user_id: id,
      post_id: postId as string,
    });

    return res.status(201).json({
      status: "success",
      message: "Postingan disukai",
    });
  } catch (error: any) {
    next(error);
  }
};

export const unLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getUserFromJwt(req);
    const { postId } = req.params;

    await unLikePostById({
      user_id: id,
      post_id: postId as string,
    });

    return res.status(200).json({
      status: "success",
      message: "Like berhasil dihapus",
    });
  } catch (error: any) {
    next(error);
  }
};

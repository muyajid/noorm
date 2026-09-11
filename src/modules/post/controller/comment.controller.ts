import { NextFunction, Request, Response } from "express";
import { getUserFromJwt } from "../../../utils/token.util";
import {
  createCommentByPostId,
  getCommentByPostId,
  getReplyByCommentId,
  replyCommentByParentId,
} from "../services/comment.service";

export const commentPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { id } = getUserFromJwt(req);

    const result = await createCommentByPostId({
      post_id: postId as string,
      user_id: id,
      comment: req.body.comment,
    });

    return res.status(201).json({
      status: "success",
      message: "Berhasil membuat commentar",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const { postId } = req.params;
    console.log(page, limit);

    const result = await getCommentByPostId({
      post_id: postId as string,
      page,
      limit,
    });

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data komentar",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const replyComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId, parentId } = req.params;
    const { id } = getUserFromJwt(req);
    const { comment } = req.body;

    const result = await replyCommentByParentId({
      post_id: postId as string,
      parent_id: parentId as string,
      user_id: id,
      comment: comment as string,
    });

    return res.status(201).json({
      status: "success",
      message: "Berhasil membalas komentar",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getReplyComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getReplyByCommentId({
      comment_id: commentId as string,
      page,
      limit,
    });

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil balasan komentar",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    next(error);
  }
};
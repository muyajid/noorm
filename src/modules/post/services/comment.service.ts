import { db } from "../../../configs/db.config";
import { createError } from "../../../exceptions/error.exception";
import {
  CommentRes,
  CreateCommentReq,
  GetPaginationReq,
  GetReplyReq,
  PaginationRes,
  ReplyCommentReq,
  ReplyRes,
} from "../dto/comment.dto";

export const createCommentByPostId = async (
  py: CreateCommentReq,
): Promise<CommentRes> => {
  try {
    const isPostExist = await db.query(`SELECT id FROM posts WHERE id = $1`, [
      py.post_id,
    ]);

    if (isPostExist.rows.length == 0) {
      throw createError(404, "Postingan tidak ditemukan");
    }

    const comment = await db.query<{
      id: string;
      parent_id: string;
      content: string;
      created_at: string;
      user_id: string;
      username: string;
    }>(
      `WITH new_comment AS (
        INSERT INTO comments (post_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, parent_id, user_id, content, created_at
      )
      SELECT
        c.id,
        c.parent_id,
        c.content,
        c.created_at,
        u.id AS user_id,
        u.username
      FROM new_comment c JOIN users u
      ON c.user_id = u.id`,
      [py.post_id, py.user_id, py.comment],
    );

    const data = comment.rows[0];
    console.log(data);

    return {
      id: data.id,
      parent_id: data.parent_id,
      comment: data.content,
      created_at: data.created_at,
      user: {
        id: data.user_id,
        username: data.username,
      },
    };
  } catch (error: any) {
    console.error(`Error durring create comment: ${error.message}`);
    throw error;
  }
};

export const getCommentByPostId = async (
  py: GetPaginationReq,
): Promise<PaginationRes> => {
  try {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM comments 
        WHERE post_id = $1 AND parent_id IS NULL`,
      [py.post_id],
    );

    const { limit, page } = py;

    const total = Number(result.rows[0].count);
    const totalPage = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const comments = await db.query(
      `SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id AS user_id,
        u.username,

        (
          SELECT COUNT(*)
          FROM comments r
          WHERE r.parent_id = c.id
        ) AS reply_count

      FROM comments c JOIN users u 
      ON c.user_id = u.id
      WHERE c.post_id = $1 
        AND parent_id IS NULL
      ORDER BY c.created_at DESC
      LIMIT $2
      OFFSET $3`,
      [py.post_id, limit, skip],
    );

    const data: CommentRes[] = comments.rows.map((d) => ({
      id: d.id,
      parent_id: d.parent_id,
      comment: d.content,
      created_at: d.created_at,
      user: {
        id: d.user_id,
        username: d.username,
      },
      reply_count: d.reply_count,
    }));

    const nextPage = page < totalPage ? page + 1 : null;

    return {
      data,
      pagination: {
        page,
        nextPage,
        limit,
        skip,
        total,
        totalPage,
      },
    };
  } catch (error: any) {
    console.error(`Error during get comment: ${error.message}`);
    throw error;
  }
};

export const replyCommentByParentId = async (
  py: ReplyCommentReq,
): Promise<CommentRes> => {
  try {
    const isParentExist = await db.query(
      `SELECT id FROM comments
        WHERE id = $1 AND post_id = $2`,
      [py.parent_id, py.post_id],
    );

    if (isParentExist.rows.length == 0) {
      throw createError(404, "Postingan atau komentar tidak ditemukan");
    }

    const result = await db.query<{
      id: string;
      parent_id: string;
      content: string;
      created_at: string;
      user_id: string;
      username: string;
    }>(
      `WITH reply_comment AS (
        INSERT INTO comments (post_id, user_id, parent_id, content)
        VALUES ($1, $2, $3, $4) 
        RETURNING id, parent_id, user_id, content, created_at
      )
      SELECT 
        c.id,
        c.parent_id,
        c.content,
        c.created_at,
        u.id AS user_id,
        u.username
      FROM reply_comment c JOIN users u
      ON c.user_id = u.id`,
      [py.post_id, py.user_id, py.parent_id, py.comment],
    );

    const data = result.rows[0];

    return {
      id: data.id,
      parent_id: data.parent_id,
      comment: data.content,
      created_at: data.created_at,
      user: {
        id: data.user_id,
        username: data.username,
      },
    };
  } catch (error: any) {
    console.error(`Error during reply comment: ${error.message}`);
    throw error;
  }
};

export const getReplyByCommentId = async (
  py: GetReplyReq,
): Promise<PaginationRes> => {
  try {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM comments WHERE parent_id = $1`,
      [py.comment_id],
    );

    const total = Number(result.rows[0].count);
    const { limit, page } = py;

    const totalPage = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const replys = await db.query(
      `SELECT
        c.id,
        c.parent_id,
        c.content,
        c.created_at,
        u.id AS user_id,
        u.username
      FROM comments c JOIN users u 
      ON c.user_id = u.id
      WHERE parent_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2
      OFFSET $3`,
      [py.comment_id, limit, skip],
    );

    const data: ReplyRes[] = replys.rows.map((d) => ({
      id: d.id,
      parent_id: d.parent_id,
      comment: d.content,
      created_at: d.created_at,
      user: {
        id: d.user_id,
        username: d.username,
      },
    }));

    const nextPage = page < totalPage ? page + 1 : null;

    return {
      data,
      pagination: {
        page,
        nextPage,
        limit,
        skip,
        total,
        totalPage,
      },
    };
  } catch (error: any) {
    console.error(`Erro during get reply comment: ${error.message}`);
    throw error;
  }
};
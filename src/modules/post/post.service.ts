import { db } from "../../configs/db.config";
import { createError } from "../../exceptions/error.exception";
import {
  CreatePostReq,
  GetPaginationRes,
  PostRes,
  UpdatePostReq,
} from "./post.dto";

export const createPostById = async (py: CreatePostReq): Promise<PostRes> => {
  try {
    const isUserExist = await db.query(`SELECT id FROM users WHERE id = $1`, [
      py.user_id,
    ]);

    if (isUserExist.rows.length == 0) {
      throw createError(404, "Pengguna tidak ditemukan");
    }

    const post = await db.query<PostRes>(
      `INSERT INTO posts (user_id, title, content)
        VALUES ($1, $2, $3)
        RETURNING id, title, content, created_at`,
      [py.user_id, py.title, py.content],
    );

    return post.rows[0];
  } catch (error: any) {
    console.error(`Post service error: ${error.message}`);
    throw error;
  }
};

export const getAllPost = async (
  page: number,
  limit: number,
): Promise<GetPaginationRes> => {
  try {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM posts`,
    );

    const total = Number(result.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    const skip = (page - 1) * limit;

    const posts = await db.query<PostRes>(
      `SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, skip],
    );

    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data: posts.rows,
      pagination: {
        page,
        nextPage,
        limit,
        skip,
        total,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error(`Post service error: ${error.message}`);
    throw error;
  }
};

export const deletePostById = async (id: string): Promise<void> => {
  try {
    const result = await db.query(`DELETE FROM posts WHERE id = $1`, [id]);

    if (result.rowCount == 0) {
      throw createError(404, "Postingan tidak ditemukan");
    }
  } catch (error: any) {
    console.error(`Post service error: ${error.message}`);
    throw error;
  }
};

export const updatePostById = async (py: UpdatePostReq): Promise<PostRes> => {
  try {
    const fields: string[] = [];
    const value: string[] = [];
    let index = 1;

    if (py.title != undefined) {
      fields.push(`title = $${index}`);
      value.push(py.title);
      index++;
    }

    if (py.content != undefined) {
      fields.push(`content = $${index}`);
      value.push(py.content);
      index++;
    }

    value.push(py.id);

    const result = await db.query<PostRes>(
      `UPDATE posts 
          SET ${fields.join(", ")},
          updated_at = CURRENT_TIMESTAMP
          WHERE id = $${index}
          RETURNING id, title, content, updated_at`,
      value,
    );

    if (result.rows.length == 0) {
      throw createError(404, "Postingan tidak ditemukan");
    }

    return result.rows[0];
  } catch (error: any) {
    console.error(`Post service error: ${error.message}`);
    throw error;
  }
};

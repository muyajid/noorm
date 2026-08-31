import { db } from "../../../configs/db.config";
import { createError } from "../../../exceptions/error.exception";
import {
  CreatePostReq,
  GetPaginationReq,
  PaginationRes,
  PostRes,
  UpdatePostReq,
} from "../post/post.dto";

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
  py: GetPaginationReq,
): Promise<PaginationRes> => {
  try {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM posts`,
    );

    const { limit, page } = py;

    const total = Number(result.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    const skip = (page - 1) * limit;
    const posts = await db.query<PostRes>(
      `SELECT 
        p.id, p.title, p.content, p.created_at,
        COUNT(l.id) AS like_count
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2
      `,
      [limit, skip],
    );

    const data: PostRes[] = posts.rows.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      created_at: p.created_at,
      like_count: Number(p.like_count),
    }));

    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data,
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

export const getPostById = async (
  py: GetPaginationReq,
): Promise<PaginationRes> => {
  try {
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM posts WHERE user_id = $1`,
      [py.user_id],
    );

    const { limit, page } = py;

    const total = Number(result.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    const skip = (page - 1) * limit;

    const posts = await db.query<PostRes>(
      `SELECT 
        p.id, p.title, p.content, p.created_at,
        COUNT(l.id) AS like_count
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE user_id = $3
      GROUP BY p.id
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2
      `,
      [limit, skip, py.user_id],
    );

    const data: PostRes[] = posts.rows.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      created_at: p.created_at,
      like_count: Number(p.like_count),
    }));

    const nextPage = page < totalPages ? page + 1 : null;

    return {
      data,
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

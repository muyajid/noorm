import { db } from "../../../configs/db.config";
import { createError } from "../../../exceptions/error.exception";
import { LikeReq } from "../post/like.dto";

export const likePostById = async (py: LikeReq): Promise<void> => {
  try {
    const isPostExist = await db.query(`SELECT id FROM posts WHERE id = $1`, [
      py.post_id,
    ]);

    if (isPostExist.rowCount == 0) {
      throw createError(404, "Postingan tidak ditemukan");
    }

    await db.query(
      `INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING`,
      [py.user_id, py.post_id],
    );
  } catch (error: any) {
    console.error(`Error during like a post: ${error.message}`);
    throw error;
  }
};

export const unLikePostById = async (py: LikeReq): Promise<void> => {
  try {
    const result = await db.query(
      `DELETE
        FROM likes 
        WHERE user_id = $1 AND post_id = $2 `,
      [py.user_id, py.post_id]
    );

    if (result.rowCount == 0) {
      throw createError(404, "Postingan tidak ditemukan");
    }
  } catch (error: any) {
    console.error(`Error during un like a post: ${error.message}`);
    throw error;
  }
};

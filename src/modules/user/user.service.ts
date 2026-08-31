import { hash } from "bcrypt";
import { db } from "../../configs/db.config";
import { CreateUserReq, UpdateUserReq, UserRes } from "./user.dto";
import { createError } from "../../exceptions/error.exception";

export const createNewUser = async (py: CreateUserReq): Promise<UserRes> => {
  try {
    const isUserExist = await db.query(
      `SELECT username, email
            FROM users
            WHERE username = $1 OR email = $2`,
      [py.username, py.email],
    );

    if (isUserExist.rows.length > 0) {
      const user = isUserExist.rows[0];

      const duplicateField =
        py.username == user.username ? "Username" : "Email";

      throw createError(400, `${duplicateField} sudah dipakai`);
    }

    const hashedPassword = await hash(py.password, 10);

    const user = await db.query<UserRes>(
      `INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email`,
      [py.username, py.email, hashedPassword],
    );

    return user.rows[0];
  } catch (error: any) {
    console.error(`User service error: ${error.message}`);
    throw error;
  }
};

export const getAllUser = async (): Promise<UserRes[]> => {
  try {
    const users = await db.query<UserRes>(
      `SELECT id, username, email FROM users`,
    );

    return users.rows;
  } catch (error: any) {
    console.error(`User service error: ${error.message}`);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserRes> => {
  try {
    const users = await db.query<UserRes>(
      `SELECT id, username, email 
      FROM users
      WHERE id = $1`,
      [id],
    );

    if (users.rows.length == 0) {
      throw createError(404, "Pengguna tidak ditemukan");
    }

    return users.rows[0];
  } catch (error: any) {
    console.error(`User service error: ${error.message}`);
    throw error;
  }
};

export const updateUserById = async (py: UpdateUserReq): Promise<UserRes> => {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (py.username != undefined) {
      fields.push(`username = $${index}`);
      values.push(py.username);
      index++;
    }

    if (py.email != undefined) {
      fields.push(`email = $${index}`);
      values.push(py.email);
      index++;
    }

    if (fields.length == 0) {
      throw createError(400, "Tidak ada data yang diupdate");
    }

    values.push(py.id);

    const result = await db.query<UserRes>(
      `UPDATE users
            SET ${fields.join(", ")},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $${index}
            RETURNING id, username, email`,
      values,
    );

    if (result.rows.length == 0) {
      throw createError(404, "Pengguna tidak ditemukan");
    }

    return result.rows[0];
  } catch (error: any) {
    console.error(`User service error: ${error.message}`);
    throw error;
  }
};

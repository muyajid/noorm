import { compare } from "bcrypt";
import { db } from "../../configs/db.config";
import { createError } from "../../exceptions/error.exception";
import { LoginReq, LoginRes } from "./auth.dto";
import { makeAuthToken } from "../../utils/token.util";

export const authLogin = async (py: LoginReq): Promise<LoginRes> => {
  try {
    const isUserExist = await db.query<{
      id: string;
      username: string;
      password: string;
    }>(
      `SELECT id, username, password
            FROM users
            WHERE username = $1`,
      [py.username],
    );

    if (isUserExist.rows.length == 0) {
      throw createError(404, "Pengguna tidak ditemukan");
    }

    const user = isUserExist.rows[0];
    const isPasswordValid: boolean = await compare(py.password, user.password);

    if (!isPasswordValid) {
      throw createError(401, "Password salah");
    }

    const accesToken = makeAuthToken({ id: user.id, username: user.username });

    return { accesToken };
  } catch (error: any) {
    console.error(`Auth service error: ${error.message}`);
    throw error;
  }
};

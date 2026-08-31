import { Request } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

const jwtSecret = String(process.env.JWT_SECRET);
const jwtExpire = process.env.JWT_EXPIRE;

export const makeAuthToken = (payload: UserPayload): string => {
  try {
    const token: string = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpire as jwt.SignOptions["expiresIn"],
    });

    return token;
  } catch (error: any) {
    console.error(`Error during make auth token: ${error.message}`);
    throw error;
  }
};

export const verifAuthToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;

    return decoded;
  } catch (error: any) {
    console.error(`Error during verif auth token: ${error.message}`);
    throw error;
  }
};

export const getUserFromJwt = (req: AuthRequest): UserPayload => {
  return req.user;
};

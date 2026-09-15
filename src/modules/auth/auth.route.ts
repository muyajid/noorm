import { Router } from "express";
import { login, register } from "./auth.controller";
import { validateRequest } from "../../middlewares/validation.middleware";
import { createUserSchema } from "../user/user.dto";
import { loginSchema } from "./auth.dto";
import { rateLimitMiddleware } from "../../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/register",
  rateLimitMiddleware(),
  validateRequest(createUserSchema),
  register,
);
router.post(
  "/login",
  rateLimitMiddleware(),
  validateRequest(loginSchema),
  login,
);

export default router;

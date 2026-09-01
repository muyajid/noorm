import { Router } from "express";
import { login, register } from "./auth.controller";
import { validateRequest } from "../../middlewares/validation.middleware";
import { createUserSchema } from "../user/user.dto";
import { loginSchema } from "./auth.dto";

const router = Router();

router.post("/register", validateRequest(createUserSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;

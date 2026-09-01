import { Router } from "express";
import { getUser, getUsers, upadateUser } from "./user.controller";
import { validateRequest } from "../../middlewares/validation.middleware";
import { updateUserSchema } from "./user.dto";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", validateRequest(updateUserSchema), upadateUser);

export default router;

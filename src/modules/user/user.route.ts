import { Router } from "express";
import { getUser, getUsers, upadateUser } from "./user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", upadateUser);

export default router;
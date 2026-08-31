import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "./post.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const route = Router();

route.post("/", authMiddleware, createPost);
route.get("/", authMiddleware, getPosts);
route.delete("/:id", authMiddleware, deletePost);
route.put("/:id", authMiddleware, updatePost);

export default route;

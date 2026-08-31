import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "./controller/post.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { likePost, unLikePost } from "./controller/like.controller";

const route = Router();

route.post("/", authMiddleware, createPost);
route.get("/", authMiddleware, getPosts);
route.get("/:id", authMiddleware, getPost);
route.delete("/:id", authMiddleware, deletePost);
route.put("/:id", authMiddleware, updatePost);

route.post("/:postId/like", authMiddleware, likePost);
route.delete("/:postId/unlike", authMiddleware, unLikePost);

export default route;

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
import { validateRequest } from "../../middlewares/validation.middleware";
import { createPostSchema, updatePostSchema } from "./post/post.dto";

const route = Router();

route.post("/", authMiddleware, validateRequest(createPostSchema), createPost);
route.get("/", authMiddleware, getPosts);
route.get("/:id", authMiddleware, getPost);
route.delete("/:id", authMiddleware, deletePost);
route.put(
  "/:id",
  authMiddleware,
  validateRequest(updatePostSchema),
  updatePost,
);

route.post("/:postId/like", authMiddleware, likePost);
route.delete("/:postId/unlike", authMiddleware, unLikePost);

export default route;

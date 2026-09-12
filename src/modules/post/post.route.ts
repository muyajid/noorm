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
import { createPostSchema, updatePostSchema } from "./dto/post.dto";
import { createCommentSchema } from "./dto/comment.dto";
import {
  commentPost,
  getComments,
  getReplyComment,
  replyComment,
} from "./controller/comment.controller";

const route = Router();

// Post service including create update get and delete post
route.post("/", authMiddleware, validateRequest(createPostSchema), createPost);
route.get("/", getPosts);
route.get("/:id", getPost);
route.delete("/:id", authMiddleware, deletePost);
route.put(
  "/:id",
  authMiddleware,
  validateRequest(updatePostSchema),
  updatePost,
);

// For like and unlike a post
route.post("/:postId/like", authMiddleware, likePost);
route.delete("/:postId/unlike", authMiddleware, unLikePost);

// For comment and reply comment
route.post(
  "/:postId/comment",
  authMiddleware,
  validateRequest(createCommentSchema),
  commentPost,
);
route.post(
  "/:postId/comment/:parentId/reply",
  authMiddleware,
  validateRequest(createCommentSchema),
  replyComment,
);
route.get("/:postId/comment", authMiddleware, getComments);
route.get("/comment/:commentId/reply", authMiddleware, getReplyComment);

export default route;

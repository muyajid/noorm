import { z } from "zod";

export interface CreateCommentReq {
  post_id: string;
  user_id: string;
  comment: string;
}

export interface CommentRes {
  id: string;
  parent_id: string | null;
  comment: string;
  created_at: string;
  user: {
    id: string;
    username: string;
  }
  reply_count?: number
}

export interface ReplyRes {
  id: string;
  parent_id: string | null;
  comment: string;
  created_at: string;
  user: {
    id: string;
    username: string;
  }
}

export interface GetPaginationReq {
  post_id: string;
  limit: number;
  page: number;
}

export interface GetReplyReq {
  comment_id: string;
  limit: number;
  page: number;
}

export interface PaginationRes {
  data: CommentRes[] | ReplyRes[];
  pagination: {
    page: number;
    nextPage: number | null;
    limit: number;
    skip: number;
    total: number;
    totalPage: number;
  };
}

export interface ReplyCommentReq {
  post_id: string;
  user_id: string;
  parent_id: string;
  comment: string;
}

export const createCommentSchema = z.object({
  comment: z
    .string({
      error: "Comment wajib diisi",
    })
    .max(500, {
      error: "Comment maksimal 500 karakter",
    }),
});

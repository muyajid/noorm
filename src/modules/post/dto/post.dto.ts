import { z, ZodType } from "zod";

export interface CreatePostReq {
  user_id: string;
  title: string;
  content: string;
}

export interface PostRes {
  id: string;
  title: string;
  content: string;
  like_count: number;
  comment_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface GetPaginationReq {
  user_id?: string;
  page: number;
  limit: number;
}

export interface PaginationRes {
  data: PostRes[];
  pagination: {
    page: number;
    nextPage: number | null;
    limit: number;
    skip: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdatePostReq {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
}

export const createPostSchema: ZodType = z.object({
  title: z
    .string({
      error: "Title wajib diisi",
    })
    .max(200, {
      error: "Title maksimal 200 karakter",
    }),
  content: z
    .string({
      error: `Content wajib diisi`,
    })
    .max(10000, {
      error: "Title maksimal 10.000 karakter",
    }),
});

export const updatePostSchema: ZodType = z.object({
  title: z
    .string({
      error: "Title harus berupa string",
    })
    .max(200, {
      error: "Title maksimal 200 karakter",
    })
    .optional(),
  content: z
    .string({
      error: "Title harus berupa string",
    })
    .max(10000, {
      error: "Title maksimal 10.000 karakter",
    }).optional(),
});

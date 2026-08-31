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
  title?: string;
  content?: string;
}
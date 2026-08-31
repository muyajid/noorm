export interface CreatePostReq {
  user_id: string;
  title: string;
  content: string;
}

export interface PostRes {
  id: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetPaginationRes {
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

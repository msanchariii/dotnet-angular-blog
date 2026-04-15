export interface CreateBlogRequest {
  userId: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
}

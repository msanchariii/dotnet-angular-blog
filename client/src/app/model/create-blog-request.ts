export interface CreateBlogRequest {
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
}

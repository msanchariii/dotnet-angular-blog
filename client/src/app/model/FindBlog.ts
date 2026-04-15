export interface FindBlog {
  blogId: string;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  createdAt: Date;
}

export interface FindBlogExtended extends FindBlog {
  readTime: string;
  avatarColor: string;
  initials: string;
}

export interface CreateBlogRequest {
  userId: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
}

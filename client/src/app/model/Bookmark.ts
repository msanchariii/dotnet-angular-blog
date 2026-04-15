export interface ToggleBookmarkRequest {
  userId: string;
  blogId: string;
}

export interface ToggleBookmarkResponse {
  isBookmarked: boolean;
}

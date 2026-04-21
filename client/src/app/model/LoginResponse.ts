export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

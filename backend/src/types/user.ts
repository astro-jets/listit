export type UserRole = 1 | 2 | 3;

export interface User {
  avatar_url?: string;
  id: string;
  username: string;
  artist_name: string;
  email: string;
  role: UserRole;
  password?: string;
}

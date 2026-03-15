export type UserRole = "admin" | "artist";

export interface User {
  id: string;
  username: string;
  artist_name: string;
  email: string;
  role: UserRole;
  password?: string;
}

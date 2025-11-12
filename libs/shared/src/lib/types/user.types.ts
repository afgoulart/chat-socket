export type UserRole = 'admin' | 'consultant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

import { Injectable, Inject } from '@nestjs/common';
import { Storage } from '../storage/storage.interface';
import { User, UserWithPassword } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject('STORAGE')
    private readonly storage: Storage
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.storage.getUserByEmail(email);

    if (!user) {
      return null;
    }

    // In production, use proper password hashing (bcrypt, etc.)
    if (user.password !== password) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'consultant' = 'consultant'
  ): Promise<User> {
    const existingUser = await this.storage.getUserByEmail(email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const userWithPassword: UserWithPassword = {
      id: uuidv4(),
      email,
      password, // In production, hash this
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await this.storage.createUser(userWithPassword);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser;
    return userWithoutPassword as User;
  }
}

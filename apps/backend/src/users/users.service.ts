import { Injectable, Inject } from '@nestjs/common';
import { Storage } from '../storage/storage.interface';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('STORAGE')
    private readonly storage: Storage
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.storage.getAllUsers();
    // Remove passwords from response
    return users.map(({ password, ...user }) => user as User);
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.storage.getUser(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.storage.updateUser(id, updates);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.storage.deleteUser(id);
  }
}

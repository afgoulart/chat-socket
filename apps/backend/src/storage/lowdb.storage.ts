import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Storage } from './storage.interface';
import { Chat, Message } from '../models/chat.model';
import { UserWithPassword, SystemConfig } from '../models/user.model';

interface DatabaseSchema {
  chats: Chat[];
  users: UserWithPassword[];
  config: SystemConfig;
}

@Injectable()
export class LowDBStorage implements Storage, OnModuleInit {
  private db: Low<DatabaseSchema>;

  async onModuleInit() {
    const file = join(process.cwd(), 'db.json');
    const adapter = new JSONFile<DatabaseSchema>(file);
    this.db = new Low(adapter, {
      chats: [],
      users: [],
      config: {
        chatTTL: 30, // Default 30 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await this.db.read();

    // Initialize with default data if needed
    if (!this.db.data) {
      this.db.data = {
        chats: [],
        users: [],
        config: {
          chatTTL: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      await this.db.write();
    }
  }

  async createChat(chat: Chat): Promise<Chat> {
    await this.db.read();
    this.db.data.chats.push(chat);
    await this.db.write();
    return chat;
  }

  async getChat(id: string): Promise<Chat | null> {
    await this.db.read();
    return this.db.data.chats.find((chat) => chat.id === id) || null;
  }

  async getAllChats(): Promise<Chat[]> {
    await this.db.read();
    return this.db.data.chats;
  }

  async updateChat(id: string, updates: Partial<Chat>): Promise<Chat | null> {
    await this.db.read();
    const index = this.db.data.chats.findIndex((chat) => chat.id === id);

    if (index === -1) return null;

    const updatedChat = {
      ...this.db.data.chats[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.db.data.chats[index] = updatedChat;
    await this.db.write();
    return updatedChat;
  }

  async deleteChat(id: string): Promise<boolean> {
    await this.db.read();
    const initialLength = this.db.data.chats.length;
    this.db.data.chats = this.db.data.chats.filter((chat) => chat.id !== id);

    if (this.db.data.chats.length < initialLength) {
      await this.db.write();
      return true;
    }

    return false;
  }

  async addMessage(chatId: string, message: Message): Promise<Message> {
    await this.db.read();
    const chat = this.db.data.chats.find((c) => c.id === chatId);

    if (!chat) {
      throw new Error(`Chat ${chatId} not found`);
    }

    chat.messages.push(message);
    chat.updatedAt = new Date();
    await this.db.write();
    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    await this.db.read();
    const chat = this.db.data.chats.find((c) => c.id === chatId);
    return chat?.messages || [];
  }

  // User operations
  async createUser(user: UserWithPassword): Promise<UserWithPassword> {
    await this.db.read();
    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }

  async getUser(id: string): Promise<UserWithPassword | null> {
    await this.db.read();
    return this.db.data.users.find((user) => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    await this.db.read();
    return this.db.data.users.find((user) => user.email === email) || null;
  }

  async getAllUsers(): Promise<UserWithPassword[]> {
    await this.db.read();
    return this.db.data.users;
  }

  async updateUser(id: string, updates: Partial<UserWithPassword>): Promise<UserWithPassword | null> {
    await this.db.read();
    const index = this.db.data.users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    const updatedUser = {
      ...this.db.data.users[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.db.data.users[index] = updatedUser;
    await this.db.write();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.db.read();
    const initialLength = this.db.data.users.length;
    this.db.data.users = this.db.data.users.filter((user) => user.id !== id);

    if (this.db.data.users.length < initialLength) {
      await this.db.write();
      return true;
    }

    return false;
  }

  // Config operations
  async getConfig(): Promise<SystemConfig> {
    await this.db.read();
    return this.db.data.config;
  }

  async updateConfig(updates: Partial<SystemConfig>): Promise<SystemConfig> {
    await this.db.read();
    this.db.data.config = {
      ...this.db.data.config,
      ...updates,
      updatedAt: new Date(),
    };
    await this.db.write();
    return this.db.data.config;
  }
}

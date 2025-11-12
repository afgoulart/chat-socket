import { Injectable } from '@nestjs/common';
import { Storage } from './storage.interface';
import { Chat, Message } from '../models/chat.model';
import { UserWithPassword, SystemConfig } from '../models/user.model';

@Injectable()
export class InMemoryStorage implements Storage {
  private chats: Map<string, Chat> = new Map();
  private users: Map<string, UserWithPassword> = new Map();
  private config: SystemConfig = {
    chatTTL: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  async createChat(chat: Chat): Promise<Chat> {
    this.chats.set(chat.id, chat);
    return chat;
  }

  async getChat(id: string): Promise<Chat | null> {
    return this.chats.get(id) || null;
  }

  async getAllChats(): Promise<Chat[]> {
    return Array.from(this.chats.values());
  }

  async updateChat(id: string, updates: Partial<Chat>): Promise<Chat | null> {
    const chat = this.chats.get(id);
    if (!chat) return null;

    const updatedChat = { ...chat, ...updates, updatedAt: new Date() };
    this.chats.set(id, updatedChat);
    return updatedChat;
  }

  async deleteChat(id: string): Promise<boolean> {
    return this.chats.delete(id);
  }

  async addMessage(chatId: string, message: Message): Promise<Message> {
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new Error(`Chat ${chatId} not found`);
    }

    chat.messages.push(message);
    chat.updatedAt = new Date();
    this.chats.set(chatId, chat);
    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const chat = this.chats.get(chatId);
    return chat?.messages || [];
  }

  // User operations
  async createUser(user: UserWithPassword): Promise<UserWithPassword> {
    this.users.set(user.id, user);
    return user;
  }

  async getUser(id: string): Promise<UserWithPassword | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    return Array.from(this.users.values()).find((u) => u.email === email) || null;
  }

  async getAllUsers(): Promise<UserWithPassword[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<UserWithPassword>): Promise<UserWithPassword | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Config operations
  async getConfig(): Promise<SystemConfig> {
    return this.config;
  }

  async updateConfig(updates: Partial<SystemConfig>): Promise<SystemConfig> {
    this.config = { ...this.config, ...updates, updatedAt: new Date() };
    return this.config;
  }
}

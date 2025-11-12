import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../storage/storage.interface';
import { Chat, Message, Client } from '../models/chat.model';

@Injectable()
export class ChatService {
  constructor(
    @Inject('STORAGE')
    private readonly storage: Storage
  ) {}

  async createChat(client?: Client): Promise<Chat> {
    const chat: Chat = {
      id: uuidv4(),
      client: client || {},
      messages: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.storage.createChat(chat);
  }

  async getChat(id: string): Promise<Chat | null> {
    return this.storage.getChat(id);
  }

  async getAllChats(): Promise<Chat[]> {
    return this.storage.getAllChats();
  }

  async updateClientInfo(chatId: string, client: Client): Promise<Chat | null> {
    return this.storage.updateChat(chatId, { client });
  }

  async sendMessage(
    chatId: string,
    content: string,
    sender: 'client' | 'consultant'
  ): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      chatId,
      content,
      sender,
      timestamp: new Date(),
    };

    return this.storage.addMessage(chatId, message);
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.storage.getMessages(chatId);
  }

  async closeChat(chatId: string): Promise<Chat | null> {
    return this.storage.updateChat(chatId, { status: 'closed' });
  }
}

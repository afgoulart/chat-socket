import { Chat, Message } from '../models/chat.model';
import { User, UserWithPassword, SystemConfig } from '../models/user.model';

export interface Storage {
  // Chat operations
  createChat(chat: Chat): Promise<Chat>;
  getChat(id: string): Promise<Chat | null>;
  getAllChats(): Promise<Chat[]>;
  updateChat(id: string, chat: Partial<Chat>): Promise<Chat | null>;
  deleteChat(id: string): Promise<boolean>;

  // Message operations
  addMessage(chatId: string, message: Message): Promise<Message>;
  getMessages(chatId: string): Promise<Message[]>;

  // User operations (internamente armazena com password)
  createUser(user: UserWithPassword): Promise<UserWithPassword>;
  getUser(id: string): Promise<UserWithPassword | null>;
  getUserByEmail(email: string): Promise<UserWithPassword | null>;
  getAllUsers(): Promise<UserWithPassword[]>;
  updateUser(id: string, user: Partial<UserWithPassword>): Promise<UserWithPassword | null>;
  deleteUser(id: string): Promise<boolean>;

  // Config operations
  getConfig(): Promise<SystemConfig>;
  updateConfig(config: Partial<SystemConfig>): Promise<SystemConfig>;
}

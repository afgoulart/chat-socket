import { Client, MessageSender } from '../types/chat.types';

export interface CreateChatDto {
  client?: Client;
}

export interface SendMessageDto {
  chatId: string;
  content: string;
  sender: MessageSender;
}

export interface UpdateClientDto {
  chatId: string;
  client: Client;
}

export interface Client {
  name?: string;
  birthDate?: string;
  location?: string;
}

export type MessageSender = 'client' | 'consultant';
export type ChatStatus = 'active' | 'closed';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
}

export interface Chat {
  id: string;
  client: Client;
  messages: Message[];
  status: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
}

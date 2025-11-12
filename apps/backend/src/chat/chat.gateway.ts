import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto, UpdateClientDto } from '../models/dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`[Gateway] joinChat chamado para chatId: ${chatId}`);
    client.join(chatId);
    const messages = await this.chatService.getMessages(chatId);
    console.log(`[Gateway] Retornando ${messages.length} mensagens para chat ${chatId}`);
    return { event: 'chatHistory', data: messages };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const message = await this.chatService.sendMessage(
      dto.chatId,
      dto.content,
      dto.sender
    );

    // Broadcast to all clients in the chat room (including sender)
    this.server.to(dto.chatId).emit('newMessage', message);

    // Notify consultants room about the update (for chat list refresh)
    // Only send if the sender is not already in consultants room to avoid duplicate
    this.server.to('consultants').emit('chatUpdate', {
      chatId: dto.chatId,
      message,
    });

    return { event: 'messageSent', data: message };
  }

  @SubscribeMessage('updateClient')
  async handleUpdateClient(
    @MessageBody() dto: UpdateClientDto,
    @ConnectedSocket() client: Socket
  ) {
    const chat = await this.chatService.updateClientInfo(dto.chatId, dto.client);

    // Notify consultants of client update
    this.server.to('consultants').emit('clientUpdated', chat);

    return chat;
  }

  @SubscribeMessage('joinConsultants')
  async handleJoinConsultants(@ConnectedSocket() client: Socket) {
    client.join('consultants');
    const chats = await this.chatService.getAllChats();
    return { event: 'allChats', data: chats };
  }

  @SubscribeMessage('getChat')
  async handleGetChat(@MessageBody() chatId: string) {
    console.log(`[Gateway] getChat chamado para chatId: ${chatId}`);
    const chat = await this.chatService.getChat(chatId);
    console.log(`[Gateway] Retornando chat com ${chat?.messages?.length || 0} mensagens`);
    return chat;
  }

  @SubscribeMessage('getAllChats')
  async handleGetAllChats() {
    const chats = await this.chatService.getAllChats();
    return chats;
  }

  @SubscribeMessage('closeChat')
  async handleCloseChat(@MessageBody() chatId: string) {
    const chat = await this.chatService.closeChat(chatId);

    // Notify all clients in the chat
    this.server.to(chatId).emit('chatClosed', chat);

    // Notify consultants
    this.server.to('consultants').emit('chatClosed', chat);

    return chat;
  }

  // Public method to emit chat closing warning (called by scheduler)
  emitChatClosingWarning(chatId: string, minutesRemaining: number) {
    console.log(`[Gateway] Emitindo aviso de fechamento para chat ${chatId} - ${minutesRemaining} min restante(s)`);
    
    // Notify the chat room (client and consultants in the chat)
    this.server.to(chatId).emit('chatClosingWarning', {
      chatId,
      minutesRemaining,
      message: `Este chat será fechado automaticamente em ${minutesRemaining} minuto(s) por inatividade.`,
    });

    // Also notify consultants room
    this.server.to('consultants').emit('chatClosingWarning', {
      chatId,
      minutesRemaining,
      message: `O chat ${chatId} será fechado em ${minutesRemaining} minuto(s) por inatividade.`,
    });
  }
}

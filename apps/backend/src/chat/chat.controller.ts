import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../models/dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() dto: CreateChatDto) {
    return this.chatService.createChat(dto.client);
  }

  @Get()
  async getAllChats() {
    return this.chatService.getAllChats();
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChat(id);
  }
}

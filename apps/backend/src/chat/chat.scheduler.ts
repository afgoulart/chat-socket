import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChatService } from './chat.service';
import { ConfigService } from '../config/config.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatScheduler {
  private readonly logger = new Logger(ChatScheduler.name);
  private readonly warnedChats = new Set<string>(); // Track chats that already received warning

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleChatTTL() {
    try {
      const config = await this.configService.getConfig();
      const ttlMinutes = config.chatTTL;
      const warningMinutes = 1; // Warn 1 minute before closing
      const allChats = await this.chatService.getAllChats();

      const now = Date.now();

      for (const chat of allChats) {
        if (chat.status === 'active') {
          const lastUpdate = new Date(chat.updatedAt).getTime();
          const timeDiff = (now - lastUpdate) / 1000 / 60; // Convert to minutes
          const timeRemaining = ttlMinutes - timeDiff;

          // Send warning when 1 minute remaining (and not already warned)
          if (timeRemaining <= warningMinutes && timeRemaining > 0 && !this.warnedChats.has(chat.id)) {
            this.warnedChats.add(chat.id);
            this.chatGateway.emitChatClosingWarning(chat.id, Math.ceil(timeRemaining));
            this.logger.log(
              `Warning sent for chat ${chat.id} - will close in ${Math.ceil(timeRemaining)} minute(s)`
            );
          }

          // Close chat when TTL is reached
          if (timeDiff >= ttlMinutes) {
            await this.chatService.closeChat(chat.id);
            this.warnedChats.delete(chat.id); // Clean up
            this.logger.log(
              `Chat ${chat.id} automatically closed after ${ttlMinutes} minutes of inactivity`
            );
          }
        } else {
          // Remove from warned list if chat is no longer active
          this.warnedChats.delete(chat.id);
        }
      }
    } catch (error) {
      this.logger.error('Error in chat TTL scheduler:', error);
    }
  }
}

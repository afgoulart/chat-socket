import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatScheduler } from './chat.scheduler';
import { ConfigModule } from '../config/config.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, StorageModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatScheduler],
  exports: [ChatService],
})
export class ChatModule {}

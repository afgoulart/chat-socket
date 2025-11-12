import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from '../storage/storage.module';
import { ChatModule } from '../chat/chat.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [StorageModule, ChatModule, AuthModule, UsersModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

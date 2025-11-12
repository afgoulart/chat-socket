import { Injectable, Inject } from '@nestjs/common';
import { Storage } from '../storage/storage.interface';
import { SystemConfig } from '../models/user.model';

@Injectable()
export class ConfigService {
  constructor(
    @Inject('STORAGE')
    private readonly storage: Storage
  ) {}

  async getConfig(): Promise<SystemConfig> {
    return this.storage.getConfig();
  }

  async updateConfig(updates: Partial<SystemConfig>): Promise<SystemConfig> {
    return this.storage.updateConfig(updates);
  }

  async getChatTTL(): Promise<number> {
    const config = await this.getConfig();
    return config.chatTTL;
  }
}

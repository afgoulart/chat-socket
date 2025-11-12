import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { SystemConfig } from '../models/user.model';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(): Promise<SystemConfig> {
    return this.configService.getConfig();
  }

  @Put()
  async updateConfig(@Body() updates: Partial<SystemConfig>): Promise<SystemConfig> {
    return this.configService.updateConfig(updates);
  }
}

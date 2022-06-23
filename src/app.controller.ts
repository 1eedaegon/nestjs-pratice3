import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  getDatabaseHostModeFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}

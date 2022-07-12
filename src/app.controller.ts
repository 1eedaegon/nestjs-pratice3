import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/authorization.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @UseGuards(AuthGuard)
  @Get()
  getDatabaseHostModeFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}

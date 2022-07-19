import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppSerivce } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppSerivce,
  ) {}
  @UseGuards(AuthGuard)
  @Get()
  getDatabaseHostModeFromConfigService(): string {
    this.appService.getHello();
    return this.configService.get('DATABASE_HOST');
  }
  @Get('/error')
  error(foo: any): string {
    return foo.bar();
  }
}

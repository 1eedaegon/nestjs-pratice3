import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppSerivce } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { ErrorsInterceptor } from './errors/errors.interceptor';

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
  @UseInterceptors(ErrorsInterceptor)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    throw new InternalServerErrorException();
  }
  @Get('/error')
  error(foo: any): string {
    return foo.bar();
  }
}

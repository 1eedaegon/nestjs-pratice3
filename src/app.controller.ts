import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hel*')
  getHello2(@Req() req: Request): string {
    console.log(req);
    return this.appService.getHello();
  }
}

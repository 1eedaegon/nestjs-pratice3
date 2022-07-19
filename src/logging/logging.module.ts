import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { MyLogger2 } from './logging.service';

@Module({
  providers: [MyLogger2],
  exports: [MyLogger2],
})
export class LoggingModule {}

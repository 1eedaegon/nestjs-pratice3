import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { MyLogger2 } from './logging.service';

@Module({
  providers: [
    MyLogger2,
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
  exports: [MyLogger2, Logger],
})
export class LoggingModule {}

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggingModule } from 'src/logging/logging.module';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  imports: [LoggingModule],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class ExceptionsModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingModule } from 'src/logging/logging.module';
import { TaskService } from './task.service';

@Module({
  imports: [LoggingModule, ScheduleModule.forRoot()],
  providers: [TaskService],
  exports: [TaskService],
})
export class BatchModule {}

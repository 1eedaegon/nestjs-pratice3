import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly logger: Logger) {}

  @Cron('* * * * * *', { name: 'cron task' })
  handleCron() {
    this.logger.log('Task calling...');
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly logger: Logger) {}

  @Cron(new Date(Date.now() + 3000))
  handleCron() {
    this.logger.log('Task calling...');
  }
}

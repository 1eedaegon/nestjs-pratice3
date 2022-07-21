import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly logger: Logger) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_11AM)
  handleCron() {
    this.logger.log('Task calling...');
  }
}

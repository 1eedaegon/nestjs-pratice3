import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  constructor(
    private readonly logger: Logger,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.addCronJob();
  }
  addCronJob() {
    const name = 'Cron job sample';
    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`Running job: ${name}`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    this.logger.log(`Cronjob added: ${name}`);
  }
}

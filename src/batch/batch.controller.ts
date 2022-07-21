import { Controller, Logger, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly logger: Logger,
  ) {}

  @Post('/start-task')
  start() {
    const job = this.schedulerRegistry.getCronJob('Cron job sample');
    job.start();
    this.logger.log('Start job: ', job.lastDate());
  }

  @Post('/stop-task')
  stop() {
    const job = this.schedulerRegistry.getCronJob('Cron job sample');
    job.stop();
    this.logger.log('Stop job: ', job.lastDate());
  }
}

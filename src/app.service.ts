import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSerivce {
  private readonly logger = new Logger(AppSerivce.name);

  getHello(): string {
    this.logger.error('loglevel: error');
    this.logger.warn('loglevel: warn');
    this.logger.log('loglevel: log');
    this.logger.verbose('loglevel: verbose');
    this.logger.debug('loglevel: debug');
    return "I'm hello world!";
  }
}

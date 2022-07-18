import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

export interface LoggerService {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  verbose?(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  setLogLevel(levels: LogLevel[]): any;
}

@Injectable()
export class MyLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }
  setLogLevel(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}

export class MyLogger2 extends ConsoleLogger {
  error(message: any, stack?: string, context?: string): void {
    super.error.apply(this, arguments);
    this.doSomething();
  }
  private doSomething() {
    console.log('If you wanna logging, write this line');
  }
}

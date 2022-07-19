import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLogger2 } from 'src/logging/logging.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: MyLogger2) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }
    const stack = exception.stack;
    const response = (exception as HttpException).getResponse();
    const log = { timestamp: new Date(), url: req.url, response, stack };
    console.log(log);
    this.logger.log(log);
    res.status((exception as HttpException).getStatus()).json(response);
  }
}

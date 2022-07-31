import * as fs from 'fs';
import * as winston from 'winston';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { utilities as nestWinstonModuleUtilies } from 'nest-winston';

import { LoggingInterceptor } from './logging/logging.interceptor';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  await makeOrmConfig();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilies.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
}
async function makeOrmConfig() {
  const configService = new ConfigService(process.env);
  const typeormConfig = configService.getTypeOrmConfig();

  if (fs.existsSync('ormconfig.json')) {
    fs.unlinkSync('ormconfig.json');
  }
  fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfig, null, 2));
}
bootstrap();

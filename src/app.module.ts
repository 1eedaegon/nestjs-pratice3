import * as dotenv from 'dotenv';
import * as path from 'path';
import * as Joi from 'joi';

import * as winston from 'winston';

import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/infra/db/entities/user.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Logger2Middleware } from './middleware/logger2.middleware';
import { UsersController } from './users/interface/users.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/authConfig';
import { HandlerRolesGuard } from './roles/roles.guard.handler';
import { AppSerivce } from './app.service';
import { LoggingModule } from './logging/logging.module';
import {
  WinstonModule,
  utilities as nestModuleWinstonUtilies,
} from 'nest-winston';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { TransformModule } from './transform/transform.module';
import { ErrorsModule } from './errors/errors.module';
import { BatchModule } from './batch/batch.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check/health-check.controller';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './health-check/dog.health';
import { UserRepository } from './users/infra/db/user.repository';
const validationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
});

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestModuleWinstonUtilies.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [authConfig, emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      connectTimeout: 30000,
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [UserEntity],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    }),
    HttpModule,
    TerminusModule,
    UsersModule,
    EmailModule,
    AuthModule,
    LoggingModule,
    ExceptionsModule,
    TransformModule,
    ErrorsModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppSerivce,
    DogHealthIndicator,
    HealthCheckController,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    // { provide: APP_GUARD, useClass: HandlerRolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Deactivate middleware when requeted GET from clients
    consumer
      .apply(LoggerMiddleware, Logger2Middleware)
      .forRoutes(UsersController);
  }
}

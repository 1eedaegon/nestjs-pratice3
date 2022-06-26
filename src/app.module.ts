import * as dotenv from 'dotenv';
import * as path from 'path';
import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';

const validationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
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
    UsersModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

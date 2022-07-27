import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './application/command/create-user.handler';
import { UserEntity } from './infra/db/entities/user.entity';
import { UserEventsHandler } from './application/events/user-events.handler';
import { UsersController } from './interface/users.controller';
import { UsersService } from './users.service';
import { UserFactory } from './domain/user.factory';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UserFactory, UserEventsHandler, UsersService, Logger],
})
export class UsersModule {}

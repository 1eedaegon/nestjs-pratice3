import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { CreateUserHandler } from './create-user.handler';
import { UserEntity } from './entities/user.entity';
import { UserEventsHandler } from './user-events.handler';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [UserEventsHandler, CreateUserHandler, UsersService, Logger],
})
export class UsersModule {}

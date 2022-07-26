import * as uuid from 'uuid';

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { EmailService } from 'src/email/email.service';

@Injectable()
@CommandHandler(CreateUserHandler)
export class CreateUserHandler implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });
    return user !== undefined;
  }
  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const isUserExist = await this.checkUserExists(email);
    if (isUserExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로 가입할 수 없습니다.',
      );
    }
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

import * as uuid from 'uuid';

import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infra/db/entities/user.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { EmailService } from 'src/email/email.service';
import { UserFactory } from 'src/users/domain/user.factory';
import { UserRepository } from 'src/users/infra/db/user.repository';

@Injectable()
@CommandHandler(CreateUserHandler)
export class CreateUserHandler implements ICommandHandler {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository')
    private userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command;
    const user = this.userRepository.findByEmail(email);
    if (user === null) {
      throw new UnprocessableEntityException(
        '해당 이메일로 가입할 수 없습니다.',
      );
    }
    const id = ulid();
    const signupVerifyToken = uuid.v1();
    await this.userRepository.save(
      id,
      name,
      email,
      password,
      signupVerifyToken,
    );
    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }

  // Has infrastructure layer
  // private async checkUserExists(emailAddress: string): Promise<boolean> {
  //   const user = await this.userRepository.findOne({ email: emailAddress });
  //   return user !== undefined;
  // }
  // private async saveUser(
  //   name: string,
  //   email: string,
  //   password: string,
  //   signupVerifyToken: string,
  // ) {
  //   const isUserExist = await this.checkUserExists(email);
  //   if (isUserExist) {
  //     throw new UnprocessableEntityException(
  //       '해당 이메일로 가입할 수 없습니다.',
  //     );
  //   }
  //   const user = new UserEntity();
  //   user.id = ulid();
  //   user.name = name;
  //   user.email = email;
  //   user.password = password;
  //   user.signupVerifyToken = signupVerifyToken;
  //   await this.userRepository.save(user);
  // }
  // private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
  //   await this.emailService.sendMemberJoinVerification(
  //     email,
  //     signupVerifyToken,
  //   );
  // }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/users/domain/repository/user.repository.interface';
import { User } from 'src/users/domain/user';
import { UserFactory } from 'src/users/domain/user.factory';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}
  //   async findByEmail(email: string): Promise<User | null> {
  //     const userEntity = await this.userRepository.findOne({ email });
  //     if (!userEntity) {
  //       return null;
  //     }
  //     const { id, name, signupVerifyToken, password } = userEntity;
  //     return this.userFactory.reconstitute();
  //   }
}

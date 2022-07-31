import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/users/domain/repository/user.repository.interface';
import { User } from 'src/users/domain/user';
import { UserFactory } from '../../domain/user.factory';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ email });
    if (!userEntity) {
      return null;
    }
    const { id, name, password, signupVerifyToken } = userEntity;
    return this.userFactory.reconstitute(
      id,
      name,
      email,
      password,
      signupVerifyToken,
    );
  }
  async save(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = id;
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await manager.save(user);
    });
  }
}

import * as uuid from 'uuid';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './interface/user-info';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './infra/db/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private connection: Connection,
    private readonly authService: AuthService,
  ) {}
  async createUser(name: string, email: string, password: string) {}

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원가입 처리중인 유저가 있는 지 조회하고 없으면 에러
    // 2. 바로 로그인 상태가 되도록 jwt 발급
    const user = await this.usersRepository.findOne({ signupVerifyToken });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는 지 DB에서 확인하고 없으면 에러
    // 2. JWT 발급
    const user = await this.usersRepository.findOne({ email, password });
    if (!user) throw new NotFoundException('존재하지 않는 유저.');
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // TODO
    // 1. userId를 가진 유저가 존재하는 지 DB에서 확인하고 없으면 에러
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');
    return { id: user.id, name: user.name, email: user.email };
  }

  async findAll(offset: number, limit: number): Promise<UserInfo[]> {
    throw new Error('Method not implemented');
  }
  async findOne(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ id });
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      // Upsert using query runner
      await queryRunner.manager.save(user);
      // Commit
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      // Deallocate transaction
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    // Transaction method controls the transactions when received Entity manager.
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}

import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './user-info';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private connection: Connection,
  ) {}
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원가입 처리중인 유저가 있는 지 조회하고 없으면 에러
    // 2. 바로 로그인 상태가 되도록 jwt 발급
    console.log('[verifyEmail] signupVerifyToken', signupVerifyToken);
    throw new Error('Method not implemented');
  }
  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는 지 DB에서 확인하고 없으면 에러
    // 2. JWT 발급
    throw new Error('Method not implemented');
  }

  async getUserInfo(userId: number): Promise<UserInfo> {
    // TODO
    // 1. userId를 가진 유저가 존재하는 지 DB에서 확인하고 없으면 에러
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    throw new Error('Method not implemented');
  }

  async findAll(offset: number, limit: number): Promise<UserInfo[]> {
    throw new Error('Method not implemented');
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email: emailAddress });
    return user !== undefined;
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
    await this.usersRepository.save(user); // TODO: DB 연동 후 구현
  }
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

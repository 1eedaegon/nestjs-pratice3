import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './user-info';

@Injectable()
export class UsersService {
  constructor(private readonly emailService: EmailService) {}
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

  async getUserInfo(userId: string): Promise<UserInfo> {
    // TODO
    // 1. userId를 가진 유저가 존재하는 지 DB에서 확인하고 없으면 에러
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    throw new Error('Method not implemented');
  }

  private checkUserExists(email: string) {
    return; // TODO: DB연동 후 구현
  }
  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO: DB 연동 후 구현
  }
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}

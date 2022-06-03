import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserInfo } from 'os';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

const { log } = console;
const { stringify } = JSON;

@Controller('users')
export class UsersController {
  // curl -v -X POST http://localhost:3000/users -H "Content-type: application/json" -d '{"name":"daegon", "email":"hello@asd.com", "password":"123"}'
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    log(`Post create user: ${dto.email}, ${dto.name}, ${dto.password}`);
    return;
  }
  // curl -v -X POST http://localhost:3000/users/email-verify\?signupVerifyToken\=test-token
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    log(`Post verify email: ${stringify(dto)}`);
    return;
  }
  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    log(dto);
    return;
  }
  //   @Get('/:id')
  //   async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  //     log(userId);
  //     return;
  //   }
}

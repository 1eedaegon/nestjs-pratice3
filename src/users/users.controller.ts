import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './user-info';
import { UsersService } from './users.service';

const { log } = console;
const { stringify } = JSON;

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}
  // curl -v -X POST http://localhost:3000/users -H "Content-type: application/json" -d '{"name":"daegon", "email":"hello@asd.com", "password":"123"}'
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { email, name, password } = dto;
    await this.usersService.createUser(name, email, password);
  }
  // curl -v -X POST http://localhost:3000/users/email-verify\?signupVerifyToken\=test-token
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return this.usersService.login(email, password);
  }

  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id')
    userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];
    this.authService.verify(jwtString);
    return this.usersService.getUserInfo(userId);
  }
  @Get()
  async findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
    return this.usersService.findAll(offset, limit);
  }
}

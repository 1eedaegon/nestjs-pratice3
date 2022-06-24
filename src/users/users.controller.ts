import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './user-info';
import { UsersService } from './users.service';
import { ValidationPipe } from './validation.pipe';

const { log } = console;
const { stringify } = JSON;

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // curl -v -X POST http://localhost:3000/users -H "Content-type: application/json" -d '{"name":"daegon", "email":"hello@asd.com", "password":"123"}'
  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
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
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ): Promise<UserInfo> {
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

import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  Headers,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  LoggerService,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { HandlerRolesGuard } from 'src/roles/roles.guard.handler';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './user-info';
import { UsersService } from './users.service';

// @UseGuards(HandlerRolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
    this.printLoggerServiceLog(dto);
    return this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id')
    userId: string,
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

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}

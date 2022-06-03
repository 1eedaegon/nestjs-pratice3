import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  BadRequestException,
  Header,
  Redirect,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const { name, email } = createUserDto;
    console.log(`${name}의 유저가 ${email}의 이메일을 가지고 등록했습니다.`);
    // return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: GetUserDto) {
    const users = this.usersService.findAll();
    return `쿼리 파라미터 ${query.limit}, ${query.offset}, 결과: ${users}`;
  }

  @Redirect('https://nestjs.com', 301)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (+id > 1) throw new BadRequestException('id는 0보다 커야한다.');
    return this.usersService.findOne(+id);
  }

  @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // Two ways route parameters
  // @Delete(':userId/memo/:memoId')
  // deleteUserMemo(@Param() params: { [key: string]: string }) {
  //   return `userId: ${params.userId}, memoId: ${params.memoId}`;
  // }

  @Delete(':userid/memo/:memoId')
  deleteUserMemo(
    @Param('userId') userId: string,
    @Param('memoId') memoId: string,
  ) {
    return `userId: ${userId}, memoId: ${memoId}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
